// default speed and the corresponding option element that will be set later
let normal = {
    speed: 1.0,
    option: null
};
// list of playback speeds
let speeds = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 3.0];
// video element and menu list
let video;
let menu;

// observe DOM for Zoom's speed control menu list and video element
const observer = new MutationObserver(() => {
    menu = document.querySelector('.vjs-speed-control .vjs-pop-menu .list');
    video = document.querySelector('video');
    if (menu && video) {
        observer.disconnect();
        init();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

function init() {
    // keyboard shortcuts listener
    document.addEventListener('keydown', e => {
        if (!e.ctrlKey && !e.altKey) {
            triggerHotkey(e.code);
        }
    });

    // build and inject speed options
    const options = [];
    for (let spd of speeds) {
        let li = createLi(spd);
        options.push(li);
        if (spd === normal.speed) normal.option = li;
    }
    menu.replaceChildren(...options);

    // set initial speed
    changeSpeed(normal.speed, normal.option);
}

function triggerHotkey(code) {
    switch (code) {
        case 'KeyK':
            document.querySelector('.vjs-play-control').click();
            break;
        case 'KeyF':
            document.querySelector('.vjs-fullscreen-toggle-control-button').click();
            break;
        case 'KeyM':
            document.querySelector('.vjs-mute-control').click();
            break;
        case 'KeyJ':
            video.currentTime -= 10;
            break;
        case 'KeyL':
            video.currentTime += 10;
            break;
    }
}

function createLi(speed) {
    // clone a template li
    let template = menu.querySelector('li');
    let li = template.cloneNode(true);
    li.removeAttribute('id');
    li.removeAttribute('aria-checked');

    // set label
    let label = speed === normal.speed ? 'Normal' : `${speed}x`;
    let span = li.querySelector('span');
    span.textContent = label;

    // click handler
    li.addEventListener('click', () => changeSpeed(speed, li));
    return li;
}

function changeSpeed(speed, li) {
    // apply playback rate
    video.playbackRate = speed;

    // reset all items
    for (let opt of menu.children) {
        opt.classList.remove('selected');
        let icon = opt.querySelector('i');
        if (icon) icon.style.display = 'none';
    }

    // highlight chosen item
    li.classList.add('selected');
    let check = li.querySelector('i');
    if (check) check.style.display = 'block';

    // update Speed button label
    let btn = document.querySelector('.vjs-speed-control > button.vjs-control');
    btn.textContent = speed === normal.speed ? 'Speed' : `${speed}x`;

    // hide the menu
    menu.parentElement.style.display = 'none';
}