import { useEffect, useState } from "react";
import { axiosInstance } from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function Home() {
  const [allNotes, setAllNotes] = useState([]);
  const [title, setTitle] = useState(""); // Changed to empty string for consistent input
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");
      console.log(response);

      if (response.data && response.data.notes) {
        console.log(response.data);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
      return error;
    }
  };

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        desc,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        setTitle("");
        setDesc("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
        onClick={logout}
      >
        Logout
      </button>

      <h2 className="mt-5 text-center text-4xl font-extrabold text-gray-800 mb-8">
        My Todo List
      </h2>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <input
          className="p-3 border-2 border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="p-3 border-2 border-gray-300 rounded-lg w-full h-24 mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg w-full shadow-md transition duration-300 ease-in-out"
          onClick={addNewNote}
        >
          Add Note
        </button>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allNotes.length > 0 ? (
          allNotes.map((item) => (
            <div
              key={item._id} // Assuming a unique _id for each note
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No notes yet! Add one above.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;