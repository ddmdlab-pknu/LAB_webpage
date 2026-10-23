import { labMemberNames } from "../data/papersData";

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[\s.\-·*]/g, "");
const labMemberSet = new Set(labMemberNames.map(normalizeName));

// 저자 목록. 연구실 구성원은 밑줄, 이름 뒤 *는 교신저자 표시 (밑줄은 이름에만 침)
const PaperAuthors = ({ authors }: { authors: string[] }) => {
  return (
    <>
      {authors.map((author, i) => {
        const isCorresponding = author.endsWith("*");
        const name = isCorresponding ? author.slice(0, -1) : author;
        return (
          <span key={`${author}-${i}`}>
            {labMemberSet.has(normalizeName(name)) ? <u>{name}</u> : name}
            {isCorresponding && "*"}
            {i < authors.length - 1 && ", "}
          </span>
        );
      })}
    </>
  );
};

export default PaperAuthors;
