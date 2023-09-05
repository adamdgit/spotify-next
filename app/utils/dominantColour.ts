import { Dispatch, SetStateAction } from "react";

type rgbProps = {
  r: number,
  g: number,
  b: number
}

// cheap way to get dominant colour from image by converting image to 1px canvas
export default function getDominantColours(imgUrl: string, setBgColour: Dispatch<SetStateAction<rgbProps>>) {

  const size = 1;
  const image = new Image();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let fixedColour: rgbProps = {
    r: 55,
    g: 55,
    b: 55
  }

  canvas.height = size;
  canvas.width = size;
  image.src = imgUrl;
  // allow cross origin url
  image.crossOrigin = "Anonymous"

  // after image loads, draw to canvas as 1 pixel and get rgba values
  image.onload = () => {
  
    // load image and create from imgurl
    ctx!.drawImage(image, 0, 0, 1, 1)

    const imageData = ctx!.getImageData(0, 0, 1, 1)
    // blue value to be fixed at 55, remove alpha
    fixedColour.r = imageData.data[0];
    fixedColour.g = imageData.data[1];
    fixedColour.b = 55;

    setBgColour(fixedColour)
  }

  // delete elements
  image.remove();
  canvas.remove();

}
