import { useEffect } from "react";
import NotesList from "../../components/Notes/NotesList";

const NotesPage = ({ dispatch, notesList, editSignal, deleteNote, resolveNote }) => {
  useEffect(() => {
    dispatch({
      type: "route",
      payload: {
        screenText: "All Notes and Alerts",
        currentPage: "notes",
        first_name: "",
        last_name: "",
      },
    });
  }, [dispatch]);

  return (
    <div>
      <div className="notespage_container">
        <div className="notespage_view_container">
          <NotesList
            allNotes={notesList}
            userSpecific={{ status: false }}
            editSignal={editSignal}
            deleteNote={deleteNote}
            resolveNote={resolveNote}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
