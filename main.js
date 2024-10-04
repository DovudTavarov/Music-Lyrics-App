// ------------ Bootstrap Modal ------------
const myModal = new bootstrap.Modal("#myModal");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const modalFooter = document.querySelector(".modal-footer");
// ------------ Bootstrap Modal ------------

// To show and hide Bootstrap Modal
// myModal.show();
// myModal.hide();
const search = document.querySelector(".search-input");
const submit = document.querySelector(".search-submit");
const list = document.querySelector(".songs");
const btn = document.querySelector(".search-btn");

const url = "https://api.lyrics.ovh";
let allSongs = [];

submit.addEventListener("submit", searchMusic);

function searchMusic(event) {
  event.preventDefault();
  const string = search.value.trim();
  if (string) {
    callFetch(url, string);
  }
}
function callFetch(url, string) {
  fetch(`${url}/suggest/${string}`)
    .then((res) => res.json())
    .then((data) => {
      allSongs = data.data;
      songsToDOM(allSongs);
    });
}
function songsToDOM(listOfSongs) {
  list.innerHTML = "";
  listOfSongs.forEach((song) => {
    const { title, artist, preview, id } = song;
    const eachSong = `<li>
                <span><strong>${artist.name}</strong> - ${title}</span>
                <div class="lyrics-player">
                    <button onclick="songInfo(${id})" class="btn btn-success">Get Lyrics</button>
                    <div class="music-player">
                    <audio controls>
                        <source
                        src="${preview}"
                        type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                    </audio>
                    </div>
                </div>
                </li>`;
    list.innerHTML += eachSong;
  });
}

function songInfo(id) {
  const song = allSongs.find((s) => s.id == id);
  fetch(`${url}/v1/${song.artist.name}/${song.title}`)
    .then((res) => res.json())
    .then((data) => {
      modalBtn(data.lyrics, id);
    });
}
function modalBtn(lyrics, id) {
  const song = allSongs.find((s) => s.id == id);
  myModal.show();
  modalTitle.innerHTML = `  <h5 class="modal-title" id="exampleModalLabel">
                            ${song.artist.name} -
                            <strong style="text-transform: uppercase">${song.title}</strong>
                            </h5>
                            <button
                            type="button"
                            class="btn btn-danger"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <span aria-hidden="true">&times;</span>
                            </button> `;
  modalBody.innerHTML = ` <div className="album-cover">
                            <img
                                class="mb-2"
                                src="${song.album.cover_medium}"
                                alt="Eminem-Houdini"
                            />
                            <div className="music-player">
                                <audio controls>
                                <source
                                    src="${song.preview}"
                                    type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                                </audio>
                            </div>
                            </div>
                            <span>${lyrics}</span>`;
}
