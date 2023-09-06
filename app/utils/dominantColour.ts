import { Dispatch, SetStateAction } from "react";

type rgbProps = {
  r: number,
  g: number,
  b: number
}

// cheap way to get dominant colour from image by converting image to 1px canvas
export default function getDominantColours(imgUrl: string, setBgColour: Dispatch<SetStateAction<rgbProps>>) {

  const size = 4;
  const image = new Image();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let fixedColour: rgbProps = {
    r: 55,
    g: 55,
    b: 55
  }

  const values: string[] = [];

  canvas.height = size;
  canvas.width = size;
  image.src = imgUrl;
  // allow cross origin url
  image.crossOrigin = "Anonymous"

  // after image loads, draw to canvas as 1 pixel and get rgba values
  image.onload = () => {

    // load image and create from imgurl
    ctx!.drawImage(image, 0, 0, size, size)

    const imageData = ctx!.getImageData(0, 0, size, size)

    for (let i = 0; i < imageData.data.length; i+=4) {
      const rgb = 
      leftPad(Math.floor(imageData.data[i] / 5) * 5) + 
      leftPad(Math.floor(imageData.data[i + 1] / 5) * 5) + 
      leftPad(Math.floor(imageData.data[i + 2] / 5) * 5)
      
      values.push(rgb)
    }

    // get most occuring value
    const mostOccuring = mode(values).match(/.{1,3}/g)

    // split into 3 sections, remove starting zeroes
    fixedColour.r = Number(mostOccuring[0])
    fixedColour.g = Number(mostOccuring[1])
    fixedColour.b = Number(mostOccuring[2])

    setBgColour(fixedColour)
  }
  // delete elements
  image.remove();
  canvas.remove();

}

function leftPad(num: number): string {
  if (num < 10) return num.toString().padStart(3, "00")
  if (num < 100 && num > 9) return num.toString().padStart(3, "0")
  return num.toString();
}

function mode(array: string[]): string {
    if(array.length == 0)
        return "";
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl.toString();
}