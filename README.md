# VideoProductDetection
Tool for recommending products based on a image detection from a live video stream.

This uses the https://github.com/karpathy/neuraltalk2 to caption a video stream. That library has been modified
to output the captions to a file that is read by a nodejs server, which hosts a video stream, captions, and
provides product recommendations from etsy using the nouns in each caption.

Setup:

- Install the neuraltalk2 library and replace videocaptioning.lua with the one included.
- Run videocaptioning.lua as instructed in the neuraltalk2 setup. This requires your video stream be mapped to /dev/video1
- Replace the ip in live-demo/server.js with your video source (for example a stream from a mobile phone).
- In live-demo/live-demo.html replace  var api_key = "Etsy API key here"; with your free etsy API key.
- To run the server:
  cd live-demo
  sudo apt-get install nodejs
  npm install
  nodejs server
