import { useEffect, useState } from "react";
import { axiosInstance } from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function Home() {
  const [allNotes, setAllNotes] = useState([]);
  const [title, setTitle] = useState([]);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();


  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");
      console.log(response);

      if (response.data && response.data.notes) {
        console.log(response.data);
        // console.log(response.data.notes)
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
                getAllNotes()
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
    <div>
      <button
        className="fixed top-2 right-2 bg-blue-500 rounded-xl p-1"
        onClick={logout}
      >
        Logout
      </button>

      <h2 className="mt-5 text-center text-2xl font-extrabold">My Todo List</h2>
      <input
      className="p-2 border-2 rounded-xl mt-[10%] ml-[40%]"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
            className="p-2 border-2 rounded-xl w-50 mt-[10px] ml-[40%] block"

        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button 
            className="p-2 border-2 rounded-xl mt-[10px] ml-[610px] block w-50 bg-blue-600"

      onClick={addNewNote}>Add</button>

        <div className="bg-blue-200 p-5 text-center rounded-2xl">
            {allNotes.map((item) => (
                <h2 className="fony=t">Title : {item.title} <span>Description : {item.desc}</span></h2>
            ))}
        </div>
    </div>
  );
}

export default Home;


