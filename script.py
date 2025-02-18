import bibtexparser
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import convert_to_unicode


def load_bib_file(file_path):
    with open(file_path, encoding="utf-8") as bibtex_file:
        parser = BibTexParser()
        parser.customization = convert_to_unicode
        bib_database = bibtexparser.load(bibtex_file, parser=parser)
    return bib_database.entries


def convert_to_bibitem(entries):
    bibitems = []
    seen_ids = set()  # Keep track of unique IDs
    for entry in entries:
        entry_id = entry.get("ID")
        if not entry_id or entry_id in seen_ids:
            continue  # Skip duplicates
        seen_ids.add(entry_id)

        authors = entry.get("author", "Unknown author").replace(" and ", ", ")
        title = entry.get("title", "No title")
        journal = entry.get("journal", "")
        booktitle = entry.get("booktitle", "")
        volume = entry.get("volume", "")
        number = entry.get("number", "")
        pages = entry.get("pages", "")
        year = entry.get("year", "")
        publisher = entry.get("publisher", "")

        bibitem = f"\\bibitem{{{entry_id}}}\n"
        bibitem += f"{authors}.\n"
        bibitem += f"\\newblock {title}.\n"
        if journal:
            bibitem += (
                f"\\newblock \\emph{{{journal}}}, {volume}({number}):{pages}, {year}.\n"
            )
        elif booktitle:
            bibitem += f"\\newblock In \\emph{{{booktitle}}}, {pages}, {year}.\n"
        if publisher and not journal and not booktitle:
            bibitem += f"\\newblock {publisher}, {year}.\n"
        bibitems.append(bibitem)
    return bibitems


def save_to_file(bibitems, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        for item in bibitems:
            f.write(item + "\n")


if __name__ == "__main__":
    input_file = "references.bib"  # Path to your .bib file
    output_file = (
        "bibitems.txt"  # Path to the output .txt file containing \bibitem entries
    )

    entries = load_bib_file(input_file)
    bibitems = convert_to_bibitem(entries)
    save_to_file(bibitems, output_file)
    print(f"Conversion complete. Check the output file: {output_file}")
