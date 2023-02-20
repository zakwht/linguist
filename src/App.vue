<script setup lang="ts">
import { toRaw } from "vue";
import type { Language, LanguageType } from "./Language.type";

defineProps<{
  languages: Language[];
}>();
</script>

<script lang="ts">
const languageTypes = ["all", "programming", "data", "markup", "prose"];

export default {
  data(): {
    filterText: string;
    displayedLanguages: Language[];
    includeTrivial: boolean;
    includeChild: boolean;
    showAlias: boolean;
    sortAsc: boolean;
    filterType: LanguageType | "all";
  } {
    return {
      filterText: "",
      displayedLanguages: this.languages
        .filter((lang) => lang.color)
        .filter((lang) => !lang.group)
        .sort((a, b) => a.name.localeCompare(b.name)),
      includeTrivial: false,
      includeChild: false,
      showAlias: false,
      sortAsc: true,
      filterType: "all"
    };
  },
  methods: {
    setLanguages() {
      this.displayedLanguages = this.languages
        .filter(
          (lang) =>
            lang.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
            lang.aliases?.some((ali) => ali.includes(this.filterText)) ||
            lang.extensions?.some((ext) => ext.includes(this.filterText)) ||
            lang.filenames?.some((fln) => fln.includes(this.filterText))
        )
        .filter((lang) => this.includeTrivial || lang.color)
        .filter((lang) => this.includeChild || !lang.group)
        .filter(
          (lang) => this.filterType == "all" || lang.type == this.filterType
        )
        .sort((a, b) =>
          this.sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
      console.log(toRaw(this.displayedLanguages));
    }
  }
};
</script>

<template>
  <form>
    <input type="text" v-model="filterText" @input="(e) => setLanguages()" />

    <fieldset>
      <label> Display Settings: </label>
      <span>
        <input
          type="checkbox"
          id="includeTrivial"
          v-model="includeTrivial"
          @input="
            (e) => {
              includeTrivial = e.target.checked;
              setLanguages();
            }
          "
        />
        <label for="includeTrivial">Include trivial languages</label> </span
      ><span>
        <input
          type="checkbox"
          id="includeChild"
          v-model="includeChild"
          @input="
            (e) => {
              includeChild = e.target.checked;
              setLanguages();
            }
          "
        />
        <label for="includeChild">Include child languages</label> </span
      ><span>
        <input type="checkbox" id="showAlias" v-model="showAlias" />
        <label for="showAlias">Show aliases</label>
      </span>
    </fieldset>

    <fieldset>
      <label>Language Type:</label>
      <span v-for="x in languageTypes">
        <input
          type="radio"
          name="languageType"
          :value="x"
          :id="x"
          :checked="filterType == x"
          @click="
            (e) => {
              filterType = e.target.value;
              setLanguages();
            }
          "
        />
        <label :for="x">{{ x }}</label>
      </span>
    </fieldset>
  </form>

  <table>
    <colgroup>
      <col span="1" style="width: 10%; min-width: 240px" />
      <col
        span="1"
        :style="
          showAlias
            ? { visibility: 'visible', width: '10%', minWidth: '400px' }
            : { visibility: 'collapse', width: 0 }
        "
      />
      <col span="1" style="width: 120px" />
      <col span="1" style="width: 45%; min-width: 240px" />
      <col span="1" style="width: 25%; min-width: 180px" />
    </colgroup>
    <tbody>
      <tr>
        <th
          style=""
          @click="
            (e) => {
              sortAsc = !sortAsc;
              setLanguages();
            }
          "
        >
          Language {{ sortAsc ? "↓" : "↑" }}
        </th>
        <th style="">Aliases</th>
        <th style="">Type</th>
        <th style="">Extensions</th>
        <th style="">Filenames</th>
      </tr>
      <tr v-if="displayedLanguages.length == 0">
        <td colspan="10">⚠ No languages match the criteria</td>
      </tr>
      <tr v-for="lang in displayedLanguages" :id="lang.name">
        <td>
          <div
            v-if="lang.color"
            class="lang-circle"
            :style="{ backgroundColor: lang.color }"
          ></div>
          <span>{{ lang.name }}</span>
        </td>
        <td class="alias">
          <span v-for="x in lang.aliases">
            {{ x }}
          </span>
        </td>
        <td>{{ lang.type }}</td>
        <td>
          <code v-for="x in lang.extensions">
            {{ x }}
          </code>
        </td>
        <td>
          <code v-for="x in lang.filenames">
            {{ x }}
          </code>
        </td>
      </tr>
    </tbody>
  </table>

  <footer>
    <address>© {{ new Date().getFullYear() }} Zak White</address>
    <a href="https://github.com/zakwht/linguist" target="_blank">
      zakwht/linguist
    </a>
    <a href="https://github.com/github/linguist" target="_blank">
      github/linguist
    </a>
  </footer>
</template>
