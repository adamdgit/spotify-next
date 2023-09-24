import { getNearestNode } from "./getNearestNode"

// drag and drop event listener handler
export function handleDragAndDrop(draggables, container, changeOrder) {

  let offset = 0;
  let timer = null;
  // 5th child of the draggable element is the drag and drop button
  draggables.forEach(element => {
    element.children[4].addEventListener('mousedown', dragStart)
    element.children[4].addEventListener('touchstart', dragStart)
  })

  function dragStart(e) {
    let element = e.target.parentElement
    let startIndex = Number(element.dataset.index)
    // create a copy of the dragging element for effect
    let clone = element.cloneNode(true)
    document.querySelector('body').appendChild(clone)
    const songlistWrapper = document.querySelector('[data-songlist]')

    console.log(element.parentElement.offsetTop)
    console.log(document.querySelector('html').scrollTop)

    // set clones styles
    clone.dataset.clone = 'clone'
    clone.style.position = 'absolute'
    clone.style.transform = 'translate(var(--x), var(--y))'
    clone.style.zIndex = '999'
    clone.style.height = `${element.offsetHeight}px`
    clone.style.width = `${element.offsetWidth}px`
    // top should be mouse y pos + y scrolled of main section
    clone.style.top = `${-55 + document.querySelector('html').scrollTop}px`
    element.style.opacity = '0.3'
    
    // mobile and web specific transforms 
    if (e.type === 'touchstart') {
      clone.style.setProperty('--x', '-50%')
      clone.style.setProperty('--y', e.changedTouches[0].clientY + 'px')
      clone.style.left = `50%`
    } else {
      clone.style.setProperty('--x', e.clientX + 'px')
      clone.style.setProperty('--y', e.clientY + 'px')
      clone.style.left = `-${e.target.offsetLeft + 10}px`
    }

    // cancel drag listener, start listening for pointermove instead
    e.preventDefault()

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('touchmove', touchMove)
    
    function mouseMove(e) {
      // scroll up or down if draggable element touches top or bottom of scroll area
      if (e.clientY < 150 || e.clientY > 1135) {
        elementIsOverflowing(e, 'web')
      } else {
        clearTimeout(timer);
      }
      // clone follows mouse cursor
      clone.style.setProperty('--x', e.clientX + 'px')
      clone.style.setProperty('--y', e.clientY + 'px')
      // find nearest element to switch places with based on cursor Y position
      let nearestNode = getNearestNode(e.clientY, draggables)
      // prevents constant rendering of element, only inserts when element is different
      if (nearestNode !== element && nearestNode !== element.nextSibling) {
        container.current.insertBefore(element, nearestNode)
      }
    }

    function touchMove(e) {
      // scroll up or down if draggable element touches top or bottom of scroll area
      if (e.changedTouches[0].clientY < 150 || e.changedTouches[0].clientY > document.querySelector('.page-wrap').offsetHeight - 100 ) {
        elementIsOverflowing(e, 'mobile')
      } else {
        clearTimeout(timer);
      }
      clone.style.setProperty('--y', e.changedTouches[0].clientY + 'px')
      let nearestNode = getNearestNode(e.changedTouches[0].clientY, draggables)
      // prevents constant rendering of element, only inserts when element is different
      if (nearestNode !== element && nearestNode !== element.nextSibling) {
        container.current.insertBefore(element, nearestNode)
      }
    }

    document.addEventListener('mouseup', placeEl)
    document.addEventListener('touchend', placeEl)
    function placeEl() {
      // remove listeners, place element, remove clone, reset timer function
      offset = 0
      clearTimeout(timer)
      songlistWrapper.style.transform = `translateY(0px)`
      element.style.opacity = '1'
      document.querySelector('[data-clone]')?.remove()
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', placeEl)
      document.removeEventListener('touchmove', touchMove)
      document.removeEventListener('touchend', placeEl)
      // get new index of moved element
      let newIndex = Array.from(container.current.childNodes).indexOf(element)
      // Only send API request if element has moved positions
      if(startIndex === newIndex) return
      changeOrder(startIndex, newIndex)
    }

    function elementIsOverflowing(e, scrollType) {
      clearTimeout(timer);
      // different scroll required for mobile or web touch / mouse events
      switch(scrollType) {
        case 'web':
          // complex checks to determine if playlist should scroll up or down
          if (window.scrollY > songlistWrapper.offsetTop && e.clientY < 150 
            || Math.abs(offset) + window.scrollY > songlistWrapper.offsetTop && e.clientY < 150) {
            timer = setTimeout(() => {
              offset +=50;
              songlistWrapper.style.transform = `translateY(${offset}px)`;
              elementIsOverflowing(e, 'web')
            }, 40)
          } else if (e.clientY > 1135) {
            timer = setTimeout(() => {
              offset -=50;
              songlistWrapper.style.transform = `translateY(${offset}px)`;
              elementIsOverflowing(e, 'web')
            }, 40)
          } else {
            clearTimeout(timer);
          }
          break;

        case 'mobile':
          if (e.changedTouches[0].clientY < 150) {
            playlistAutoScroll(e, true)
          } else if (e.changedTouches[0].clientY > document.querySelector('.page-wrap').offsetHeight) {
            playlistAutoScroll(e, false)
          } else {
            clearTimeout(timer);
          }
          break;
          
        default :
          clearTimeout(timer);
          break;
      }
    }

  }

  return dragStart;

}
