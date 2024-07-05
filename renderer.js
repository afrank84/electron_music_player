// renderer.js
document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    const audioPlayer = document.getElementById('audioPlayer');
  
    if (files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      audioPlayer.src = fileURL;
      audioPlayer.play();
    }
  });
  