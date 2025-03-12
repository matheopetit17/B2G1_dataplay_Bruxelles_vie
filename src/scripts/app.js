import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger) 

gsap.to('#Vroom',{
	scrollTrigger: '#Vroom',
	
	})