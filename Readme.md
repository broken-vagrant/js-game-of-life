# Conway's Game of Life
## Why I built the project this way
- This project is js-only version of Game of Life, I built this to measure performance diff between js-wasm, js-only and react versions.
- Here are [js-wasm](https://github.com/zkindest/rust-wa-game-of-life), [react](https://github.com/zkindest/react-game-of-life) repos.
## Usage
```ts
npm run start // dev server
npm run build // outputs `dist` folder with wasm file and static (html,css,js,etc) files.
npm run deploy // deploy to gh-pages 
```