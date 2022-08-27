import ramsey from './backgrounds/ramsey.jpg' 
import janetMelody from './backgrounds/janetMelody.jpg' 
import brrrrr from './backgrounds/brrrrr.jpg' 
import clarg from './backgrounds/clarg.jpg' 
import dad from './backgrounds/dad.png' 
import christmas from './backgrounds/christmas.jpg' 
import grandbama from './backgrounds/grandbama.jpg' 
import dunce from './backgrounds/dunce.jpg' 
import namesjeff from './backgrounds/namesjeff.jpg' 
import chain from './backgrounds/chain.jpg' 
import melody from './backgrounds/melody.jpg' 
import sox from './backgrounds/sox.jpg' 
import bama from './backgrounds/bama.jpg' 
import evan from './backgrounds/evan.jpg' 
let images = [
	ramsey,
	janetMelody,
	brrrrr,
	clarg,
	dad,
	christmas,
	grandbama,
	dunce,
	namesjeff,
	chain,
	melody,
	sox,
	bama,
	evan,
]
export function getRandomImage() {
	return images[Math.floor(Math.random() * images.length)]
}
