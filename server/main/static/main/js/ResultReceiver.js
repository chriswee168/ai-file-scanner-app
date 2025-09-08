import { ProgressBar } from "./ProgressBar.js";
import { ScanButton } from "./ScanButton.js";

/**
 * ResultReceiver is responsible for receiving the byte chunk predictions made
 * by the AI model on server.
 */
export class ResultReceiver
{
    // Constructor.
    constructor() {}

    /**
     * Setter method for chunk scanning progress bar object.
     * 
     * @param {ProgressBar} chunkScanBar Chunk scanning progress bar object.
     */
    setChunkScanBar(chunkScanBar)
    {
        this.chunkScanBar = chunkScanBar;
    }

    /**
     * Setter method for array of category/class progress bar objects.
     * 
     * @param {Array<ProgressBar>} categoryBars Array of progress bar objects for each
     * class/category [clean, warning, malicious].
     */
    setCategoryBars(categoryBars)
    {
        this.categoryBars = categoryBars;
    }

    /**
     * Setter method for scan button, required so scan button is made
     * unavailable during the chunk scanning process.
     * 
     * @param {ScanButton} scanButton Scan button object.
     */
    setScanButton(scanButton)
    {
        this.scanButton = scanButton;
    }

    /**
     * Method to start server side event to receive continuous predictions
     * of byte chunks from the AI model on server.
     * 
     * @param {Object<string, string>} data Contains the filepath of selected file
     * and the name of the AI model.
     */
    async startStream(data)
    {
         // Get CSRF token.
        let csrftoken = document.cookie.split("=")[1];

        let response = await fetch(
            "/main/prediction-conf/",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "ContentType": "application/json",
                    "X-CSRFToken": csrftoken
                }

            }
        )
        if (!response.ok)
        {
            console.log(response.statusText, response.status);
        }

        // Start the server side event to begin the file byte chunk
        // scanning process.
        let eventSource = new EventSource("/main/chunk-scanner/");

        // Initialize chunk scanning progress bar to zero.
        this.chunkScanBar.setValue(0, 1);

        // Initialize all class/category progress bars to zero.
        let valueArray = [];
        for (let i = 0; i < this.categoryBars.length; i++)
        {
            valueArray.push(0)
            this.categoryBars[i].setValue(0, 1);
        }

        let limit = 0;
        let maxLimit = data;
        eventSource.onmessage = (event) => {
            let data = JSON.parse(event.data);
            let classIdx = data.chunkClass;
            value_array[classIdx] += 1;
            console.log(value_array);
        }
    }
}