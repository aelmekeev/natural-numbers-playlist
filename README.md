# natural-numbers-playlist

![validation](https://github.com/aelmekeev/natural-numbers-playlist/actions/workflows/validation.yml/badge.svg) ![auth](https://github.com/aelmekeev/natural-numbers-playlist/actions/workflows/auth.yml/badge.svg) ![sync](https://github.com/aelmekeev/natural-numbers-playlist/actions/workflows/sync.yml/badge.svg)

All you need to build a playlist of songs with the natural numbers as names. Here is the [Spotify playlist itself](https://open.spotify.com/playlist/3aMXF1tA7L1ml1XrEqpa0s).

## Rules

1. Song titles is a sequence of natural numbers, either as a digit, or its' word representation in English.
   * Special characters are ignored, so `'79` and `5'1` are considered valid for `79` and `51` respectively.
   * "Remastered" and "Year of Remastered" are ignored, so `'39 - Remastered 2011` is considered valid for `39`.
2. Playlist includes only songs with lyrics.
   * Non-english lyrics are allowed unless they marked as explicit.
3. No duplicates among artists.
4. [Artist popularity](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks) should be at least `25`.

## Contribution

Feel free to raise:
* pull requests for new feature, bug fixes or update to the tracks list
* issues to highlight any tracks that do not comply with the rules and should be replaced.

## Development

This repository contains:

1. List of tracks in `playlist.json`.
2. Automated validations for some rules.
   * Validation is performed as part of pipeline and also daily on schedule.
3. Automated synchronization of Spotify playlist with `playlist.json`.
   * This is happening on after each successful Validation in main branch.

### Notes

The following can be run to dump an existing public playlist to `playlist.json`.

```
SPOTIFY_CLIENT_ID=<client_id> SPOTIFY_CLIENT_SECRET=<client_secret> node ./utils/spotify/dump-playlist.js <playlist_id>
YOUTUBE_API_KEY=<youtube api key> node ./utils/youtube/enrich-playlist.js <playlist id>
```

The following URL can be used to generate authorization code for the user authorization flow.

```
https://accounts.spotify.com/authorize?response_type=code&client_id=<client_id>&scope=playlist-modify-public&redirect_uri=http://localhost:8888/callback
```
