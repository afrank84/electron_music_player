document.getElementById('fileInput').addEventListener('change', async function (event) {
  const files = event.target.files;
  const audioPlayer = document.getElementById('audioPlayer');
  const metadataDiv = document.getElementById('metadata');
  const copyButton = document.getElementById('copyButton');
  const coverArt = document.getElementById('coverArt');

  if (files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      audioPlayer.src = fileURL;
      audioPlayer.play();

      const arrayBuffer = await files[0].arrayBuffer();
      const metadata = await window.electron.parseMetadata(arrayBuffer);
      console.log(metadata);

      // Display metadata
      metadataDiv.innerHTML = `<pre id="metadataText">${JSON.stringify(metadata, null, 2)}</pre>`;

      // Display cover art if available, otherwise show default
      if (metadata.common.picture && metadata.common.picture.length > 0) {
          const picture = metadata.common.picture[0];
          const base64String = Buffer.from(picture.data).toString('base64');
          coverArt.src = `data:${picture.format};base64,${base64String}`;
      } else {
          coverArt.src = 'art.jpg';
      }

      // Enable the copy button and add event listener
      copyButton.disabled = false;
      copyButton.addEventListener('click', () => {
          const metadataText = document.getElementById('metadataText').innerText;
          navigator.clipboard.writeText(metadataText).then(() => {
              alert('Metadata copied to clipboard!');
          }).catch(err => {
              console.error('Failed to copy metadata: ', err);
          });
      });
  }
});

document.getElementById('select-folder-button').addEventListener('click', async () => {
  const files = await window.electron.selectFolder();
  const fileList = document.getElementById('file-list');
  const audioPlayer = document.getElementById('audioPlayer');
  const metadataDiv = document.getElementById('metadata');
  const copyButton = document.getElementById('copyButton');
  const coverArt = document.getElementById('coverArt');
  fileList.innerHTML = '';

  files.forEach(file => {
      const li = document.createElement('li');
      li.textContent = file;
      li.classList.add('list-group-item');
      li.addEventListener('click', async () => {
          // Remove 'active' class from all list items
          document.querySelectorAll('#file-list li').forEach(item => {
              item.classList.remove('active');
          });
          // Add 'active' class to the clicked item
          li.classList.add('active');
          audioPlayer.src = file;
          audioPlayer.play();

          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          const metadata = await window.electron.parseMetadata(arrayBuffer);
          console.log(metadata);

          // Display metadata
          metadataDiv.innerHTML = `<pre id="metadataText">${JSON.stringify(metadata, null, 2)}</pre>`;

          // Display cover art if available, otherwise show default
          if (metadata.common.picture && metadata.common.picture.length > 0) {
              const picture = metadata.common.picture[0];
              const base64String = Buffer.from(picture.data).toString('base64');
              coverArt.src = `data:${picture.format};base64,${base64String}`;
          } else {
              coverArt.src = 'art.jpg';
          }

          // Enable the copy button and add event listener
          copyButton.disabled = false;
          copyButton.addEventListener('click', () => {
              const metadataText = document.getElementById('metadataText').innerText;
              navigator.clipboard.writeText(metadataText).then(() => {
                  alert('Metadata copied to clipboard!');
              }).catch(err => {
                  console.error('Failed to copy metadata: ', err);
              });
          });
      });
      fileList.appendChild(li);
  });
});

// Update cover art on click
document.getElementById('coverArt').addEventListener('click', async () => {
  const { filePath } = await window.electron.showOpenDialog();
  if (filePath) {
      document.getElementById('coverArt').src = filePath;
      // Here you can add code to update the metadata with the new cover art
  }
});
