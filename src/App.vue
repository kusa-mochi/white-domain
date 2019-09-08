<template>
  <div id="app">
    <h2>White Domain Badge - Your white domain list</h2>
    <div>Write domains (separeted by comma) and press ENTER key to register "white" domains.</div>
    <div v-if="isDuplicateErrorMessageVisible" class="duplicate-error-message">
      <span class="duplicate-error-message-domain">{{duplicateDomain}}</span> is already in your white domain list.
    </div>
    <div class="input-area">
      <input
        type="text"
        placeholder="slash-mochi.net,google.com,youtube.com"
        class="domain-input"
        v-model="addItemText"
        v-on:keydown.enter="addItem"
      />
    </div>
    <table>
      <tbody>
        <domain-list-row
          v-for="item in domainListData"
          v-bind:key="item.id"
          v-bind:list-item="item"
          v-on:delete="deleteItem($event)"
        ></domain-list-row>
      </tbody>
    </table>
    <div class="link">How to use: <a href="https://slash-mochi.net/?p=2530">slash-mochi.net</a>.</div>
  </div>
</template>

<script>
import DomainListRow from "./components/DomainListRow.vue";

export default {
  name: "app",
  data() {
    return {
      domainListData: [],
      addItemText: "",
      isDuplicateErrorMessageVisible: false,
      duplicateDomain: ""
    };
  },
  methods: {
    getDomainFromUrl(url) {
      return url
        .replace("http://www.", "")
        .replace("https://www.", "")
        .replace("http://", "")
        .replace("https://", "")
        .split(/[/?#]/)[0];
    },
    trimWWWFromDomain(domain) {
      let output = domain;

      if (output.length < 5) {
        return domain;
      }

      const domainHead = domain.slice(0, 4);
      if (domainHead === "www.") {
        output = output.slice(4);
      }

      return output;
    },
    addItem() {
      console.log("begin addItem()");
      if (this.addItemText.length === 0) return;
      let inputDomains = this.addItemText.replace(/\s+/g, "").split(",");

      let currentAddIndex = this.domainListData.length + 1;
      for (let iDomain = 0; iDomain < inputDomains.length; iDomain++) {
        let inputDomain = inputDomains[iDomain];
        if (inputDomain === "") continue;

        inputDomain = this.getDomainFromUrl(inputDomain);
        inputDomain = this.trimWWWFromDomain(inputDomain);

        // if a domain is already registered
        if (
          this.domainListData.some(item => {
            return item.domain === inputDomain;
          })
        ) {
          if (inputDomains.length === 1) {
            this.duplicateDomain = inputDomain;
            this.isDuplicateErrorMessageVisible = true;
            this.addItemText = "";
            return;
          } else {
            continue;
          }
        }

        this.domainListData.push({
          id: currentAddIndex++,
          domain: inputDomain
        });
      }

      this.saveData(this.domainListData);
      this.isDuplicateErrorMessageVisible = false;
      this.addItemText = "";
    },
    deleteItem(id) {
      console.log("begin deleteItem()");
      this.domainListData.some((v, i) => {
        if (id === v.id) this.domainListData.splice(i, 1);
      });

      this.saveData(this.domainListData);
    },
    serialize(data) {
      let dataToSave = "";

      for (let iDomain = 0; iDomain < data.length; iDomain++) {
        dataToSave += data[iDomain].domain;
        if (iDomain < data.length - 1) {
          dataToSave += ",";
        }
      }

      return dataToSave;
    },
    saveData(data) {
      console.log("begin saveData()");
      if (data === undefined || data === null) {
        console.log("saveData(data): data is undefined or null.");
        return;
      }
      if (data.length === 0) {
        console.log("saveData(data): there is no data.");
        return;
      }

      let dataToSave = this.serialize(data);
      console.log("dataToSave: " + dataToSave);

      chrome.storage.sync.set({ domains: dataToSave }, function() {});
    },
    deserialize(list) {
      let output = [];
      const tmpList = list.split(",");
      for (let i = 0; i < tmpList.length; i++) {
        output.push({
          id: i,
          domain: tmpList[i]
        });
      }
      return output;
    },
    loadData() {
      console.log("begin loadData()");
      chrome.storage.sync.get("domains", result => {
        console.log("storage get: " + result.domains);
        if (result.domains === undefined || result.domains === null) {
          this.domainListData = [];
        } else {
          this.domainListData = this.deserialize(result.domains);
        }
      });
    }
  },
  mounted() {
    this.loadData();
  },
  components: {
    DomainListRow
  }
};
</script>

<style scoped>
.duplicate-error-message {
  color: red;
}

.duplicate-error-message-domain {
  font-weight: bold;
}

.domain-input {
  width: 500px;
}

.produced-by {
  font-size: 11px;
}
</style>
