document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-source');
    const playlistElement = document.getElementById('playlist');
    const trackTitle = document.getElementById('track-title');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBarContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const albumArt = document.getElementById('album-art');
    const playerView = document.getElementById('player-view');
    const playlistView = document.getElementById('playlist-view');
    const menuBtn = document.getElementById('menu-btn');
    const musicPlayerElement = document.querySelector('.music-player');

    const songs = [
        { title: "PLACEHOLD1", artist: "ARTIST1", src: "audio/audio1mp3", artwork: "images/coversong1.jpg" },
        { title: "PLACEHOLD2", artist: "ARTIST2", src: "audio/audio2.mp3", artwork: "images/coversong2.jpg" },
        { title: "PLACEHOLD3", artist: "ARTIST3", src: "audio/audio3.mp3", artwork: "images/coversong3.jpg" },
    ];


    let currentTrackIndex = 0;
    let isPlaying = false;

     function loadTrack(index) {
        if (index >= 0 && index < songs.length) {
            const track = songs[index];
            trackTitle.textContent = track.title;
            trackTitle.title = track.title; 
            audio.src = track.src;
            albumArt.src = track.artwork || 'images/default-cover.png';
            albumArt.alt = `${track.title} Album Art`;
            currentTrackIndex = index;

            updatePlaylistHighlight();
            resetProgress();

            audio.onloadedmetadata = () => {
                updateTotalDuration();
                if (isPlaying) { playTrack(); }
            };
            audio.onerror = (e) => {
                console.error("Error loading audio:", audio.error, "Source:", audio.src);
                trackTitle.textContent = "Error Loading";
                trackTitle.title = "Error loading audio";
                albumArt.src = 'images/default-cover.png';
                resetProgress();
            };
        } else { console.error("Track index out of bounds:", index); }
    }
    function resetProgress() {
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalDurationEl.textContent = '0:00';
    }
    function playTrack() {
        if (!audio.src || audio.src === window.location.href) {
             console.warn("No audio source loaded to play.");
             if (songs.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < songs.length) { loadTrack(currentTrackIndex); return; }
             else { return; }
        }
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                updatePlaylistHighlight();
            }).catch(error => {
                console.error("Playback Error:", error);
                isPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                if (error.name === 'NotSupportedError') {
                    console.error("Audio format may not be supported.");
                    trackTitle.textContent = "Format Error";
                    albumArt.src = 'images/default-cover.png';
                }
            });
        } else {
             isPlaying = true;
             playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
             updatePlaylistHighlight();
        }
    }
    function pauseTrack() {
        isPlaying = false;
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        updatePlaylistHighlight();
    }
    function togglePlayPause() { if (isPlaying) { pauseTrack(); } else { playTrack(); } }
    function prevTrack() {
        const wasPlaying = isPlaying;
        currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
        isPlaying = wasPlaying; loadTrack(currentTrackIndex);
    }
    function nextTrack() {
        const wasPlaying = isPlaying;
        currentTrackIndex = (currentTrackIndex + 1) % songs.length;
        isPlaying = wasPlaying; loadTrack(currentTrackIndex);
    }
    function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percentage}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            if (totalDurationEl.textContent === '0:00' || totalDurationEl.textContent === '-:--') { updateTotalDuration(); }
        } else {
             progress.style.width = '0%';
             currentTimeEl.textContent = formatTime(audio.currentTime || 0);
             if (totalDurationEl.textContent !== '-:--') { updateTotalDuration(); }
        }
    }
    function updateTotalDuration() {
        if (audio.duration && !isNaN(audio.duration)) {
            totalDurationEl.textContent = formatTime(audio.duration);
        } else { totalDurationEl.textContent = '-:--'; }
    }
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) { return '-:--'; }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    function setProgress(e) {
        const progressBarElement = progressBarContainer.querySelector('.progress-bar');
        if (!progressBarElement) return;
        const rect = progressBarElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = progressBarElement.clientWidth;
        if (audio.duration && !isNaN(audio.duration) && width > 0) {
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration; updateProgress();
        }
    }

    function buildPlaylist() {
        playlistElement.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title}`;
            li.title = `${song.title} - ${song.artist}`;
            li.dataset.index = index;
            li.addEventListener('click', () => {
                loadTrack(index);
                isPlaying = true;
                showPlayerView();
            });
            playlistElement.appendChild(li);
        });
        updatePlaylistHighlight();
    }

    function updatePlaylistHighlight() {
        const listItems = playlistElement.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.classList.toggle('playing', index === currentTrackIndex);
        });
    }

    function adjustVolume() {
        audio.volume = volumeSlider.value;
    }

    function showPlayerView() {
        playerView.style.display = 'flex';
        playlistView.style.display = 'none';
        menuBtn.textContent = 'Menu';
    }

    function showPlaylistView() {
        playerView.style.display = 'none';
        playlistView.style.display = 'flex';
        playlistView.style.flexDirection = 'column';
        menuBtn.textContent = 'Back';
    }

    if (musicPlayerElement) {
        let isWindowDragging = false;
        let initialMouseX, initialMouseY;
        let initialElementX, initialElementY;

        const noDragSelector = 'button, input, .progress-bar, .playlist li, a';

        musicPlayerElement.addEventListener('mousedown', dragStartMouse);
        musicPlayerElement.addEventListener('touchstart', dragStartTouch, { passive: false });

        function dragStartMouse(e) {
            if (e.target.closest(noDragSelector) ||
                (getComputedStyle(playlistView).display !== 'none' && playlistView.contains(e.target))) {
                if (e.target === playlistView) {
                   return;
                }
                if (e.target.closest(noDragSelector)){
                    return;
                }
                 return;
            }

            const rect = musicPlayerElement.getBoundingClientRect();
            initialElementX = rect.left;
            initialElementY = rect.top;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            isWindowDragging = true;
            musicPlayerElement.classList.add('dragging');
            musicPlayerElement.style.position = 'absolute';

            document.addEventListener('mousemove', dragMouse);
            document.addEventListener('mouseup', dragEndMouse);
        }

        function dragMouse(e) {
            if (!isWindowDragging) return;
            const currentX = initialElementX + (e.clientX - initialMouseX);
            const currentY = initialElementY + (e.clientY - initialMouseY);
            musicPlayerElement.style.left = `${currentX}px`;
            musicPlayerElement.style.top = `${currentY}px`;
        }

        function dragEndMouse() {
            if (!isWindowDragging) return;
            isWindowDragging = false;
            musicPlayerElement.classList.remove('dragging');
            document.removeEventListener('mousemove', dragMouse);
            document.removeEventListener('mouseup', dragEndMouse);
        }

        function dragStartTouch(e) {
             if (e.target.closest(noDragSelector) ||
                (getComputedStyle(playlistView).display !== 'none' && playlistView.contains(e.target))) {
                 if (e.target === playlistView) {
                    return;
                 }
                 if (e.target.closest(noDragSelector)){
                    return;
                 }
                  return;
            }

            e.preventDefault();

            const rect = musicPlayerElement.getBoundingClientRect();
            initialElementX = rect.left;
            initialElementY = rect.top;
            initialMouseX = e.touches[0].clientX;
            initialMouseY = e.touches[0].clientY;
            isWindowDragging = true;
            musicPlayerElement.classList.add('dragging');
            musicPlayerElement.style.position = 'absolute';

            document.addEventListener('touchmove', dragTouch, { passive: false });
            document.addEventListener('touchend', dragEndTouch);
            document.addEventListener('touchcancel', dragEndTouch);
        }

         function dragTouch(e) {
            if (!isWindowDragging) return;
            e.preventDefault();
            const currentX = initialElementX + (e.touches[0].clientX - initialMouseX);
            const currentY = initialElementY + (e.touches[0].clientY - initialMouseY);
            musicPlayerElement.style.left = `${currentX}px`;
            musicPlayerElement.style.top = `${currentY}px`;
        }

        function dragEndTouch() {
             if (!isWindowDragging) return;
            isWindowDragging = false;
            musicPlayerElement.classList.remove('dragging');
            document.removeEventListener('touchmove', dragTouch);
            document.removeEventListener('touchend', dragEndTouch);
            document.removeEventListener('touchcancel', dragEndTouch);
        }
    }

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('loadedmetadata', updateTotalDuration);
    progressBarContainer.addEventListener('click', (e) => {
        if (e.target.closest('.progress-bar')) { setProgress(e); }
    });
    volumeSlider.addEventListener('input', adjustVolume);
    menuBtn.addEventListener('click', () => {
        if (getComputedStyle(playlistView).display === 'none') {
            showPlaylistView();
        } else {
            showPlayerView();
        }
    });

    buildPlaylist();
    if (songs.length > 0) {
        loadTrack(currentTrackIndex);
    } else {
        trackTitle.textContent = "No Songs Loaded";
        trackTitle.title = "No Songs Loaded";
        albumArt.src = 'images/default-cover.png';
        currentTimeEl.textContent = '0:00';
        totalDurationEl.textContent = '0:00';
        playPauseBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        progressBarContainer.style.pointerEvents = 'none';
    }
    adjustVolume();
    showPlayerView();

});