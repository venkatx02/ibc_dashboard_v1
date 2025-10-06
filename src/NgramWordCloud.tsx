import WordCloud from "react-d3-cloud";

type NgramData = {
  ngram: string;
  freq: number;
};

type Props = {
  data: NgramData[];
  minPx?: number;
  maxPx?: number;
};

export default function NgramWordCloud({ data, minPx = 14, maxPx = 72 }: Props) {
  const values = data.map(d => d.freq);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const scale = (v: number) => {
    if (!isFinite(min) || !isFinite(max)) return (minPx + maxPx) / 2;
    if (min === max) return (minPx + maxPx) / 2;
    return minPx + ((v - min) * (maxPx - minPx)) / (max - min);
  };

  return (
    <div style={{width: "800px", height: "600px",}}>
    <WordCloud data={data.map(({ ngram, freq }) => ({ text: ngram, value: freq }))} width={600} height={400} fontSize={(d) => scale(d.value)} rotate={() => 0} />
    </div>
  );
}
