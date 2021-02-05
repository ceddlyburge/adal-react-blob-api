import { getAuthenticationToken } from './adalConfig';
import './App.css';
const { BlobServiceClient } = require("@azure/storage-blob");

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={listContainersAdalFromToken}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

const listContainersAdalFromToken = async () => {
    let token = await getAuthenticationToken()
    let tokenCredential = new CustomTokenCredential(token);

    const blobServiceClient = new BlobServiceClient(
        `https://archiebackup.blob.core.windows.net`,
        tokenCredential
    );

    let iter = blobServiceClient.listContainers();
    let containerItem = await iter.next();
    while (!containerItem.done) {
        console.log(`Container: ${containerItem.value.name}`);
        containerItem = await iter.next();
    }
}

class CustomTokenCredential {
  token;
  expiresOn;

  constructor(token, expiresOn) {
    this.token = token;
    if (expiresOn == undefined) {
      this.expiresOn = Date.now() + 60 * 60 * 1000;
    } else {
      this.expiresOn = expiresOn.getTime();
    }
  }

  async getToken(_scopes, _options) {
    console.log(_scopes, _options);
    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn,
    };
  }
}
