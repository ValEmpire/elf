import { storage, ref, uploadString } from "/scripts/firebase/index.js";

// this is the object where we will save the base64
// key is the number of the image
const imageStrings = {};

const laptopURLs = [];

// we will call this each time the firebase returns successful
const compileLaptopURLs = (userID, fileName) => {
  const url = `https://firebasestorage.googleapis.com/v0/b/elf-2e2a6.appspot.com/o/${userID}%2F${fileName}.jpg?alt=media`;

  laptopURLs.push(url);

  return url;
};

// we will call this after successful upload in firebase storage
const saveToDB = (urls) => {
  return $.post("/laptop_images", { urls }, (data) => {
    console.log(data);
  });
};

document.getElementById("pro-image").addEventListener(
  "change",
  function readImage(e) {
    // initialize num
    var num = 0;

    // if on change event triggers, enable the button
    $("#uploadImageBtn").prop("disabled", false);

    if (window.File && window.FileList && window.FileReader) {
      var files = e.target.files; //FileList object

      var output = $(".preview-images-zone");

      for (let i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.type.match("image")) continue;

        var picReader = new FileReader();

        picReader.addEventListener("load", function (event) {
          var picFile = event.target;

          imageStrings[num] = picFile.result;

          var html =
            '<div class="preview-image preview-show-' +
            num +
            '">' +
            '<div class="image-cancel" data-no="' +
            num +
            '">x</div>' +
            '<div class="image-zone"><img id="pro-img-' +
            num +
            '" src="' +
            picFile.result +
            '"></div>';

          output.append(html);
          num = num + 1;
        });

        picReader.readAsDataURL(file);
      }
      // reset the id pro-image
      $("#pro-image").val("");
    } else {
      console.log("Browser not support");
    }
  },
  false
);

$(document).on("click", ".image-cancel", function () {
  // get the index of image
  let no = $(this).data("no");

  // delete the key in imageStrings
  delete imageStrings[no];

  // check if imageStrings length is 0
  // disbale if true
  if (Object.keys(imageStrings).length === 0) {
    $("#uploadImageBtn").prop("disabled", true);
  }

  // remove the image in preview
  $(".preview-image.preview-show-" + no).remove();
});

const resetUpload = async (self) => {
  setTimeout(function () {
    $(self).text("Upload");
    $(self).prop("disabled", true);

    for (const key in imageStrings) {
      delete imageStrings[key];
    }

    $(".preview-image").remove();
  }, 1000);
};

// submit all images in preview in firebase
$("#uploadImageBtn").on("click", async function () {
  $(this).prop("disabled", true);

  $(this).text("Uploading...");

  // get the userID
  const userID = $("#userID").val();

  const metadata = {
    contentType: "image/jpeg",
  };

  const generateFileName = () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    return r;
  };

  // loop all the imageStrings
  for (const key in imageStrings) {
    var base64result = imageStrings[key].split(",")[1];

    // generate fileName
    const fileName = generateFileName();

    const laptopsRef = ref(storage, `user${userID}/${fileName}.jpg`);

    // save to storage
    await uploadString(laptopsRef, base64result, "base64", metadata);

    compileLaptopURLs(userID, fileName);
  }

  // save all the urls is postgres
  // await saveToDB(laptopURLs);

  $(this).text("Success");

  resetUpload(this);

  console.log("upload success!");
});
