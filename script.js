let pos = 0;
let neu = 0;
let neg = 0;

const commentsList = [];

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
        {
            headers: { Authorization: `Bearer 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` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

function findMax(data) {

    let highestScore = -1;
    let labelWithHighestScore = null;

    for (const pair of data[0]) {
        const score = pair.score;
        if (score > highestScore) {
            highestScore = score;
            labelWithHighestScore = pair.label;
        }
    }

    return labelWithHighestScore;
}


async function sentimentAnalyzer(comment) {
    const result = await query({ inputs: comment });
    console.log(result);
    const sentiment = findMax(result);
    console.log(sentiment);

    if (sentiment === "positive") {
        pos++;
        return 1;
    } else if (sentiment === "neutral") {
        neu++;
        return 2;
    } else if (sentiment === "negative") {
        neg++;
        return 3;
    } else {
        neu++;
        return 2;
    }
}

function parseCsv(csv) {
    const lines = csv.trim().split('\n');
    const list = [];
    for (const line of lines) {
        const value = line.trim();
        if (value) {
            list.push(value);
        }
    }
    return list;
}

async function processFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async function () {
        const csv = reader.result;
        const list = parseCsv(csv);
        for (const comment of list) {
            await sentimentAnalyzer(comment);
        }
        visualizeSentiment();
    };
    reader.onerror = function () {
        console.log(reader.error);
    };
}

function visualizeSentiment() {
    console.log(pos, neu, neg);
    const tot = pos + neu + neg;
    pos = ((pos / tot) * 100).toPrecision(4);
    neu = ((neu / tot) * 100).toPrecision(4);
    neg = ((neg / tot) * 100).toPrecision(4);
    const ctx = document.getElementById('pie-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [pos, neu, neg],
                backgroundColor: ['green', 'yellow', 'red'],
            }],
        },
    });
}

function dropHandler(event) {
  event.preventDefault();

  let file = event.dataTransfer.files[0];

  if (file.type === "text/csv") {
    
     let fileName = document.getElementById("file-name");
     fileName.textContent = file.name;

     let reader = new FileReader();

     reader.onload = function() {

       let fileContent = reader.result;
     };

     reader.readAsText(file);

   } else {

     alert("Please upload a csv file");

   }
}

function dragOverHandler(event) {
  event.preventDefault();
}

function fileInputHandler(event) {
  let file = event.target.files[0];

  if (file.type === "text/csv") {

    let fileName = document.getElementById("file-name");
    fileName.textContent = file.name;

    let reader = new FileReader();

    reader.onload = function() {

      let fileContent = reader.result;
    };

    reader.readAsText(file);

  } else {

    alert("Please upload a csv file");

  }
}

function displayPBIX() {
    let existingIframe = document.getElementById('pbix-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }
    let iframe = document.createElement('iframe');
    iframe.id = 'pbix-iframe';
    iframe.src = 'images/sih_pbi_ss.png';
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.name = "pbix-iframe";
    document.body.appendChild(iframe);
  }