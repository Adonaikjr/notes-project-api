const knex = require("../database/knex");

class notes_controller {
  async createNote(req, res) {
    const { title, description, tags, links } = req.body;

    const  user_id = req.user.id;

    const note_id = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const insertLink = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });
    await knex("links").insert(insertLink);

    const insertTags = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });
    await knex("tags").insert(insertTags);
    return res.json();
  }
  async detailsNote(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return res.json({
      ...note,
      tags,
      links,
    });
  }
  async deleteNote(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.json();
  }
  async listNotes(req, res) {
    const { title,  tags } = req.query;
    const user_id = req.user.id
    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("title", `%${title}%`) //whereLike()
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id") //innerJoin conectar as tabelas
        .groupBy('notes.title')
        .orderBy("notes.title"); // orderBy ordernar() pelos tirulos da nota
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    
    const newMapNotes = notes.map((notesMap) => {

      const noteTags = userTags.filter((tagFilter) =>
       tagFilter.note_id === notesMap.id);

        return {
            ...notesMap,
            tags: noteTags
        }

    });
    

    return res.json(newMapNotes);
  }
}
module.exports = notes_controller;
