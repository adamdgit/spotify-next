import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {


}

// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   const refresh_token = req.query.refresh_token;
//   const authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       const access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });

// console.log('Listening on 8888');
// app.listen(8888);