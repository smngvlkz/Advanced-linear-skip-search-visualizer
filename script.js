let skipList = [];
let comparisonList = [];
let currentIndex = 0;
let expressIndex = 0;
let searchValue;
let isSearching = false;
let isStepMode = false;

function createSkipList() {
    const listSize = parseInt(document.getElementById('listSize').value);
    const expressInterval = parseInt(document.getElementById('expressInterval').value);
    skipList = [];
    comparisonList = [];
    
    for (let i = 0; i < listSize; i++) {
        const value = Math.floor(Math.random() * 100);
        skipList.push({
            value: value,
            isExpress: i % expressInterval === 0
        });
        comparisonList.push({
            value: value,
            isExpress: false
        });
    }
    
    renderSkipList();
    renderComparisonList();
    resetVisualization();
    updateExplanation();
}

function renderSkipList() {
    const skipListElement = document.getElementById('skipList');
    skipListElement.innerHTML = '';
    skipList.forEach((node, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `node w-10 h-10 border border-gray-300 flex items-center justify-center text-sm ${node.isExpress ? 'express' : ''}`;
        nodeElement.textContent = node.value;
        nodeElement.id = `node-${index}`;
        skipListElement.appendChild(nodeElement);
    });
}

function renderComparisonList() {
    const comparisonElement = document.getElementById('comparison');
    comparisonElement.innerHTML = '';
    comparisonList.forEach((node, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `node border border-gray-300 flex items-center justify-center text-xs`;
        nodeElement.textContent = node.value;
        nodeElement.id = `comparison-node-${index}`;
        comparisonElement.appendChild(nodeElement);
    });
}

function startSearch() {
    if (isSearching) return;
    resetVisualization();
    searchValue = parseInt(document.getElementById('searchValue').value);
    if (isNaN(searchValue)) {
        log('Please enter a valid number.');
        return;
    }
    isSearching = true;
    isStepMode = false;
    currentIndex = 0;
    expressIndex = 0;
    highlightNode(currentIndex, 'current');
    log(`Starting search for value: ${searchValue}`);
    updateExplanation();
    setTimeout(searchStep, getAnimationSpeed());
}

function stepSearch() {
    if (isSearching && !isStepMode) return;
    if (!isSearching) {
        resetVisualization();
        searchValue = parseInt(document.getElementById('searchValue').value);
        if (isNaN(searchValue)) {
            log('Please enter a valid number.');
            return;
        }
        isSearching = true;
        isStepMode = true;
        currentIndex = 0;
        expressIndex = 0;
        highlightNode(currentIndex, 'current');
        log(`Starting search for value: ${searchValue}`);
        updateExplanation();
    } else {
        searchStep();
    }
}

function searchStep() {
    if (expressIndex < skipList.length && skipList[expressIndex].value < searchValue) {
        log(`Checking express node at index ${expressIndex}: ${skipList[expressIndex].value}`);
        highlightNode(currentIndex, '');
        currentIndex = expressIndex;
        highlightNode(currentIndex, 'current');
        expressIndex += parseInt(document.getElementById('expressInterval').value);
        updateExplanation();
        if (!isStepMode) {
            setTimeout(searchStep, getAnimationSpeed());
        }
    } else {
        log(`Value found between indexes ${currentIndex} and ${Math.min(expressIndex, skipList.length - 1)}`);
        setTimeout(() => linearSearch(Math.min(expressIndex, skipList.length - 1)), isStepMode ? 0 : getAnimationSpeed());
    }
}

function linearSearch(endIndex) {
    if (currentIndex <= endIndex) {
        log(`Checking node at index ${currentIndex}: ${skipList[currentIndex].value}`);
        highlightComparisonNode(currentIndex, 'current');
        if (skipList[currentIndex].value === searchValue) {
            log(`Value ${searchValue} found at index ${currentIndex}`);
            highlightNode(currentIndex, 'found');
            highlightComparisonNode(currentIndex, 'found');
            isSearching = false;
            updateExplanation();
            return;
        }
        highlightNode(currentIndex, '');
        highlightComparisonNode(currentIndex, '');
        currentIndex++;
        highlightNode(currentIndex, 'current');
        updateExplanation();
        if (!isStepMode) {
            setTimeout(() => linearSearch(endIndex), getAnimationSpeed() / 2);
        }
    } else {
        log(`Value ${searchValue} not found in the skip list.`);
        isSearching = false;
        updateExplanation();
    }
}

function highlightNode(index, className) {
    if (index < skipList.length) {
        const node = document.getElementById(`node-${index}`);
        node.className = `node w-10 h-10 border border-gray-300 flex items-center justify-center text-sm ${skipList[index].isExpress ? 'express' : ''} ${className}`;
    }
}

function highlightComparisonNode(index, className) {
    if (index < comparisonList.length) {
        const node = document.getElementById(`comparison-node-${index}`);
        node.className = `node border border-gray-300 flex items-center justify-center text-xs ${className}`;
    }
}

function resetVisualization() {
    skipList.forEach((_, index) => {
        highlightNode(index, '');
        highlightComparisonNode(index, '');
    });
    document.getElementById('log').innerHTML = '';
    isSearching = false;
    isStepMode = false;
    currentIndex = 0;
    expressIndex = 0;
    updateExplanation();
}

function log(message) {
    const logElement = document.getElementById('log');
    logElement.innerHTML += `<p>${message}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function getAnimationSpeed() {
    return parseInt(document.getElementById('animationSpeed').value);
}

function updateExplanation() {
    const explanationElement = document.getElementById('explanation');
    let explanation = `
        <p>The Linear Skip Search algorithm is an improvement over the standard linear search for sorted lists. It uses an "express lane" to skip over multiple elements at once, reducing the number of comparisons needed.</p>
        <p>Current state:</p>
        <ul>
            <li>Search value: ${searchValue || 'Not set'}</li>
            <li>Current index: ${currentIndex}</li>
            <li>Express index: ${expressIndex}</li>
        </ul>
        <p>Next step: ${getNextStepExplanation()}</p>
    `;
    explanationElement.innerHTML = explanation;
}

function getNextStepExplanation() {
    if (!isSearching) {
        return "Start a new search by entering a value and clicking 'Start Search' or 'Step Through'.";
    }
    if (expressIndex < skipList.length && skipList[expressIndex].value < searchValue) {
        return `Check the next express node at index ${expressIndex}.`;
    }
    if (currentIndex <= Math.min(expressIndex, skipList.length - 1)) {
        return `Perform linear search starting from index ${currentIndex}.`;
    }
    return "Search complete.";
}

createSkipList();
