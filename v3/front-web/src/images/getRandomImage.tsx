import dunce from './backgrounds/dunce.jpg' 
import sox from './backgrounds/sox.png' 
import grandbama from './backgrounds/grandbama.jpg' 
import clarg from './backgrounds/clarg.jpg' 
import chain from './backgrounds/chain.jpg' 
import melodyp2 from './backgrounds/melodyp2.jpg' 
import epic from './backgrounds/epic.jpg' 
import ramsey from './backgrounds/ramsey.jpg' 
import janetMelody from './backgrounds/janetMelody.jpg' 
import melody from './backgrounds/melody.png' 
import cash from './backgrounds/cash.jpg' 
import dad from './backgrounds/dad.png' 
import bama from './backgrounds/bama.jpg' 
import christmas from './backgrounds/christmas.jpg' 
let images = [
	dunce,
	sox,
	grandbama,
	clarg,
	chain,
	melodyp2,
	epic,
	ramsey,
	janetMelody,
	melody,
	cash,
	dad,
	bama,
	christmas,
]
export function getRandomImage() {
	return images[Math.floor(Math.random() * images.length)]
}
