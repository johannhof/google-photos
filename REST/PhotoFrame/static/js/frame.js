// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Empties the grid of images.
function clearPreview() {
  showPreview(null, null);
}

function showGallery(source, mediaItems) {
  var data = [];
  $.each(mediaItems, (i, item) => {
    // Compile the caption, conisting of the description, model and time.
    const description = item.description ? item.description : '';
    const model = item.mediaMetadata.photo.cameraModel ?
        `#Shot on ${item.mediaMetadata.photo.cameraModel}` :
        '';
    const time = item.mediaMetadata.creationTime;
    const captionText = `${description} ${model} (${time})`

    data.push({
      //image: `${item.baseUrl}=w500-h500`,
      //thumb: 'thumb1.jpg',
      image: `${item.baseUrl}=w${item.mediaMetadata.width}-h${
      item.mediaMetadata.height}`,
      //title: 'my first image',
      description: captionText,
    });
  });

  shuffle(data);

  Galleria.run('.galleria', {
    autoplay: 45000,
    carousel: false,
    dataSource: data,
    fullscreenCrop: "landscape",
    thumbnails: 'numbers',
    pauseOnInteraction: false,
  });

  document.addEventListener("keyup", function(e) {
    if(e.key === "Escape") {
      Galleria.get(0).exitFullscreen();
    }
  });
}

// Makes a backend request to display the queue of photos currently loaded into
// the photo frame. The backend returns a list of media items that the user has
// selected. They are rendered in showPreview(..).
function loadQueue() {
  $.ajax({
    type: 'GET',
    url: '/getQueue',
    dataType: 'json',
    success: (data) => {
      // Queue has been loaded. Display the media items as a grid on screen.
      showGallery(data.parameters, data.photos);
      console.log('Loaded queue.');
    },
    error: (data) => {
      handleError('Could not load queue', data)
    }
  });
}

$(document).ready(() => {
  // Load the queue of photos selected by the user for the photo
  loadQueue();

  // Clicking log out opens the log out screen.
  $('#logout').on('click', (e) => {
    window.location = '/logout';
  });
});

Galleria.on('loadfinish', function(e) {
  hideLoadingDialog();
});

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
