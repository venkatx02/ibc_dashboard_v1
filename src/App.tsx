import "./App.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import NgramBarChart from "./NgramBarChart";
import NgramWordCloud from "./NgramWordCloud";

type MetadataRow = {
  filename: string;
  document_id: number;
  book_id: number;
  author: string;
  text_length: number;
  copyright: string | null;
  sample: number;
  title: string;
  book_title: string;
  full_title: string;
  document_group: string;
  topic: string;
  role: string | null;
  url1_google: string | null;
  image1_google: string | null;
  url2_openlib: string | null;
  image2_openlib: string | null;
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metadata, setMetadata] = useState<MetadataRow[]>([]);

  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);

  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const [copyrights, setCopyrights] = useState<string[]>([]);
  const [selectedCopyrights, setSelectedCopyrights] = useState<string[]>([]);

  const [ngramSize, setNgramSize] = useState(1);
  const [removeStopwords, setRemoveStopwords] = useState(true);

  const [ngramData, setNgramData] = useState<{ ngram: string; freq: number; document_id: number }[]>([]);

  const ngramOptions = [
  { value: 1, label: "1 (Unigrams)" },
  { value: 2, label: "2 (Bigrams)" },
  { value: 3, label: "3 (Trigrams)" }
  ];

  const [metadataLoading, setMetadataLoading] = useState(true);
  const [ngramLoading, setNgramLoading] = useState(true);

useEffect(() => {
  fetch("https://mydyekyqspuzynwqcnvo.supabase.co/storage/v1/object/public/ibc_words/ngrams-data/IBC_metadata_v1_mini.json")
    .then((r) => r.json())
    .then((data: MetadataRow[]) => {
      setMetadata(data);

      const uniqueTitles = Array.from(
        new Set(data.map((r) => r.book_title).filter(Boolean))
      ).sort();
      setTitles(uniqueTitles);

      const uniqueAuthors = Array.from(
        new Set(data.map((r) => r.author))
      ).sort();
      setAuthors(uniqueAuthors);

      const uniqueGroups = Array.from(
        new Set(data.map((r) => r.document_group).filter(Boolean))
      ).sort();
      setGroups(uniqueGroups);

      const uniqueTopics = Array.from(
        new Set(data.map((r) => r.topic).filter(Boolean))
      ).sort();
      setTopics(uniqueTopics);

      const uniqueCopyrights = Array.from(
        new Set(data.map((r) => r.copyright).filter(Boolean))
      ).sort() as string[];
      setCopyrights(uniqueCopyrights);
    }).finally(() => setMetadataLoading(false));
}, []);

useEffect(() => {
  setNgramLoading(true);
  const filePath = `https://mydyekyqspuzynwqcnvo.supabase.co/storage/v1/object/public/ibc_words/ngrams-data/n=${ngramSize}_no_stopwords=${removeStopwords ? "True" : "False"}.json`;

  fetch(filePath)
    .then((r) => r.json())
    .then((data) => {
      setNgramData(data);
    }).finally(() => setNgramLoading(false));
}, [ngramSize, removeStopwords]);

  const filtered = metadata.filter((row) => {
    return (
      (selectedTitles.length === 0 || selectedTitles.includes(row.book_title)) &&
      (selectedAuthors.length === 0 || selectedAuthors.includes(row.author)) &&
      (selectedGroups.length === 0 || selectedGroups.includes(row.document_group)) &&
      (selectedTopics.length === 0 || selectedTopics.includes(row.topic)) &&
      (selectedCopyrights.length === 0 || selectedCopyrights.includes(row.copyright ?? ""))
    );
  });

  const allowedDocIds = new Set(filtered.map((doc) => doc.document_id));

  const filteredNgrams = ngramData.filter((ng) => allowedDocIds.has(ng.document_id));

  const aggregated = filteredNgrams.reduce((acc, row) => {
    acc[row.ngram] = (acc[row.ngram] || 0) + row.freq;
    return acc;
  }, {} as Record<string, number>);

  const sortedData = Object.entries(aggregated)
  .map(([ngram, freq]) => ({ ngram, freq }))
  .sort((a, b) => b.freq - a.freq);

  const top10Data = sortedData.slice(0, 10);
  const top100Data = sortedData.slice(0, 100);

  return (
    <div className="app">
    <div className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <h1 className="navbar-title">IBC Dashboard v1</h1>
      </div>
    </div>

    <div className="layout">
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>Apply Filters</h2>
          <label>
            Title<Select isMulti options={titles.map((t) => ({ value: t, label: t }))} value={selectedTitles.map((t) => ({ value: t, label: t }))} onChange={(selected) => setSelectedTitles(selected.map((s) => s.value))} placeholder="Select titles..." className="filter-select" />
          </label>
          <label>
            Authors<Select isMulti options={authors.map((a) => ({ value: a, label: a }))} value={selectedAuthors.map((a) => ({ value: a, label: a }))} onChange={(selected) => setSelectedAuthors(selected.map((s) => s.value))} placeholder="Select authors..." className="filter-select" />
          </label>
          <label>
            Ideology Group<Select isMulti options={groups.map((i) => ({ value: i, label: i }))} value={selectedGroups.map((i) => ({ value: i, label: i }))} onChange={(selected) => setSelectedGroups(selected.map((s) => s.value))} placeholder="Select ideology groups..." className="filter-select" />
          </label>
          <label>
            Topic<Select isMulti options={topics.map((to) => ({ value: to, label: to }))} value={selectedTopics.map((to) => ({ value: to, label: to }))} onChange={(selected) => setSelectedTopics(selected.map((s) => s.value))} placeholder="Select topics..." className="filter-select" />
          </label>
          <label>
            Year Published<Select isMulti options={copyrights.map((c) => ({ value: c, label: c }))} value={selectedCopyrights.map((c) => ({ value: c, label: c }))} onChange={(selected) => setSelectedCopyrights(selected.map((s) => s.value))} placeholder="Select years..." className="filter-select" />
          </label>
          <label>
            N-gram Size<Select options={ngramOptions} value={ngramOptions.find((o) => o.value === ngramSize)} onChange={(selected) => setNgramSize(selected?.value || 1)} placeholder="Select n-gram size..." isSearchable={false} className="filter-select" />
          </label>
          <label><input type="checkbox" checked={removeStopwords} onChange={(e) => setRemoveStopwords(e.target.checked)} className="filter-select" />Exclude Stopwords</label>
      </div>
        <div className="content">
          <div className="description">
            This dashboard is designed to explore word usage patterns in the Ideological Books Corpus, a collection of 500 American political books. Use the filters on the left (title, author, ideology group, topic, year, and n‑gram size) to subset the corpus and update the charts. The bar chart shows the most frequent tokens in the selected subset; higher bars indicate words that appear more often relative to others. The word cloud provides a visual overview of the same frequencies, where larger words are more common. Together, they help compare language across authors, ideologies, topics, and time.
          </div>
        {metadataLoading || ngramLoading ? (
        <div className="loading">Loading filters and charts...</div>
        ) : (
        <div className="chart-container">
            <NgramBarChart data={top10Data} />
            <NgramWordCloud data={top100Data} />
        </div>
        )}
        </div>
      </div>
    </div>
  );
}
