import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger) 

document.addEventListener("DOMContentLoaded", () => {
    const carContainer = document.getElementById("Vroom");
    const textElement = carContainer.querySelector(".textRoute");
    const tunnels = document.querySelectorAll(".tunnel");

    const messages = [
        "12% des accidents et 13% des décès sur les routes wallonnes sont survenus par temps de pluie",
        "Les piétons sont la catégorie avec le plus de blessés graves et de morts avec 31%",
        "10 accidents par jour en moyenne dans Bruxelles",
        "Depuis les normes de vitesse adaptée à 30km/h en ville, les morts dues aux accidents ont diminué de fois 2 entre 2020 et 2021"
    ];

    let messageIndex = 0;
    let lastChange = 0;
    const delay = 1000; 
    const lastTunnel = tunnels[tunnels.length - 1]; 

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const now = Date.now();
                if (now - lastChange < delay) return;
                lastChange = now;

                textElement.classList.add("hidden");
                setTimeout(() => {
                    textElement.textContent = messages[messageIndex];
                    textElement.classList.remove("hidden");
                    messageIndex = (messageIndex + 1) % messages.length;
                }, 500);
            }
        });
    }, { threshold: 1.0 });

    tunnels.forEach(tunnel => observer.observe(tunnel));

    const lastTunnelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const carRect = carContainer.getBoundingClientRect();
                const tunnelRect = lastTunnel.getBoundingClientRect();

                if (carRect.top >= tunnelRect.top && carRect.bottom <= tunnelRect.bottom) {
                    carContainer.style.position = "relative";
                }
            }
        });
    }, { threshold: 0.9 });
    lastTunnelObserver.observe(lastTunnel);
});



