document.addEventListener("DOMContentLoaded", function ()
{
	const noteContainer = document.getElementById("note-container");
	const newNoteButton = document.getElementById("new-note-button");
	const colorForm = document.getElementById("color-form");
	const colorInput = document.getElementById("color-input");

	let noteColor = localStorage.getItem("noteColor") || null;
	let noteIdCounter = Number(localStorage.getItem("noteIdCounter")) || 0;

	function readNotes ()
	{
		let notes = localStorage.getItem("notes");

		if (!notes)
		{
			notes = [];
		}
		else
		{
			notes = JSON.parse(notes);
		}

		return notes;
	}

	function saveNotes (notes)
	{
		localStorage.setItem("notes", JSON.stringify(notes));
	}

	function loadNotes ()
	{
		const notes = readNotes();

		for (const note of notes)
		{
			const noteElement = document.createElement("textarea");
			noteElement.setAttribute("data-note-id", note.id.toString());
			noteElement.value = note.content;
			noteElement.className = "note";
			noteElement.style.backgroundColor = noteColor;
			noteContainer.appendChild(noteElement);
		}
	}

	loadNotes();

	function addNewNote ()
	{
		const id = noteIdCounter;
		const content = `Note ${id}`;

		const note = document.createElement("textarea");
		note.setAttribute("data-note-id", id.toString());
		note.value = content;
		note.className = "note";
		note.style.backgroundColor = noteColor;
		noteContainer.appendChild(note);

		noteIdCounter++;

		const notes = readNotes();
		notes.push({id, content});
		saveNotes(notes);
		localStorage.setItem("noteIdCounter", noteIdCounter.toString());
	}

	colorForm.addEventListener("submit", function (event)
	{
		event.preventDefault();

		const newColor = colorInput.value.trim();

		const notes = document.querySelectorAll(".note");
		for (const note of notes)
		{
			note.style.backgroundColor = newColor;
		}

		colorInput.value = "";

		noteColor = newColor;

		localStorage.setItem("noteColor", noteColor);
	});

	newNoteButton.addEventListener("click", function ()
	{
		addNewNote();
	});

	document.addEventListener("dblclick", function (event)
	{
		if (event.target.classList.contains("note"))
		{
			event.target.remove();

			const id = Number(event.target.getAttribute("data-note-id"));

			const notes = readNotes();

			for (let i = 0; i < notes.length; i++)
			{
				if (notes[i].id === id)
				{
					notes.splice(i, 1);
				}
			}

			saveNotes(notes);
		}
	});

	noteContainer.addEventListener("blur", function (event)
	{
		if (event.target.classList.contains("note"))
		{
			const id = Number(event.target.getAttribute("data-note-id"));

			const notes = readNotes();

			for (let i = 0; i < notes.length; i++)
			{
				if (notes[i].id === id)
				{
					notes[i].content = event.target.value;
				}
			}

			saveNotes(notes);
		}
	}, true);

	window.addEventListener("keydown", function (event)
	{
		if (event.target.id === "color-input" || event.target.type === "textarea")
		{
			return;
		}

		if (event.key === "n" || event.key === "N")
		{
			addNewNote();
		}
	});
});
