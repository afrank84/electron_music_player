document.getElementById('fileInput').addEventListener('change', async function (event) {
    const files = event.target.files;
    const audioPlayer = document.getElementById('audioPlayer');
  
    if (files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      audioPlayer.src = fileURL;
      audioPlayer.play();
  
      const arrayBuffer = await files[0].arrayBuffer();
      const metadata = await window.electron.parseMetadata(arrayBuffer);
      console.log(metadata);
      // Display metadata in the UI
    }
  });
  