const projectImages = Array.from(document.querySelectorAll('.project img'))
const fallbackImage = '/assets/img/project-placeholder.png'

loadFallbackImage()

function loadFallbackImage() {
  projectImages.forEach(img => {
    img.onerror = (e) => {
      e.target.src = fallbackImage
    }
  })
}