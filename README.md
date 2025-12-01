# BibTeX to Bibitem Converter

A professional tool to convert BibTeX bibliography entries to `\bibitem` format for LaTeX documents. Available as both a Python CLI tool and a web application.


## 🎯 Features

- **Web Interface**: Modern, clean web app for instant conversion
  - Paste BibTeX text or upload `.bib` files
  - Real-time conversion preview
  - Editable output for customization
  - One-click copy to clipboard
  - Download as `.txt` file
  
- **Python CLI Tool**: Command-line interface for batch processing
  - Process entire `.bib` files
  - Handles multiple entry types (articles, books, conference papers)
  - Preserves special LaTeX characters
  - Removes duplicate entries automatically

- **Professional Output**: Properly formatted `\bibitem` entries compatible with standard LaTeX documents

## 🌐 Web Application

**Try it online**: [https://imranpollob.github.io/BibTeX-to-Bibitem/](https://imranpollob.github.io/BibTeX-to-Bibitem/)

### Usage

1. **Paste** BibTeX entries directly into the text area, or
2. **Upload** a `.bib` file
3. View the converted `\bibitem` entries
4. Edit the output if needed
5. **Copy** to clipboard or **Download** as a file

## 💻 Python CLI Tool

### Installation

```bash
# Clone the repository
git clone https://github.com/imranpollob/BibTeX-to-Bibitem.git
cd BibTeX-to-Bibitem

# Install dependencies
pip install -r requirements.txt
```

### Quick Start

```bash
# Convert references.bib to bibitems.txt
python script.py

# Test the converter
python test_converter.py
```

### Usage

#### Basic Conversion

Place your BibTeX entries in `references.bib` and run:

```bash
python script.py
```

Output will be saved to `bibitems.txt`.

#### Custom Input/Output

```bash
python script.py --input my_references.bib --output my_bibitems.txt
```

## 📖 Example

### Input (BibTeX)

```bibtex
@article{lahat2015multimodal,
  title={Multimodal data fusion: an overview of methods, challenges, and prospects},
  author={Lahat, Dana and Adali, T{\"u}lay and Jutten, Christian},
  journal={Proceedings of the IEEE},
  volume={103},
  number={9},
  pages={1449--1477},
  year={2015},
  publisher={IEEE}
}
```

### Output (Bibitem)

```latex
\bibitem{lahat2015multimodal}
Lahat, Dana, Adali, Tülay, Jutten, Christian.
\newblock Multimodal data fusion: an overview of methods, challenges, and prospects.
\newblock \emph{Proceedings of the IEEE}, 103(9):1449--1477, 2015.
```

## 📝 Using Converted Bibitems in LaTeX

Once converted, use the `\bibitem` entries in your LaTeX document:

```latex
\documentclass{article}
\usepackage[numbers]{natbib}

\begin{document}

\section{Introduction}
This is a citation example \cite{lahat2015multimodal}.

\section{Bibliography}
\begin{thebibliography}{150}

\bibitem{lahat2015multimodal}
Lahat, Dana, Adali, Tülay, Jutten, Christian.
\newblock Multimodal data fusion: an overview of methods, challenges, and prospects.
\newblock \emph{Proceedings of the IEEE}, 103(9):1449--1477, 2015.

% Add more \bibitem entries here...

\end{thebibliography}

\end{document}
```

## 🧪 Testing

Run the test script to verify the converter works correctly:

```bash
python test_converter.py
```

The test script will:
- Create sample BibTeX entries
- Convert them to bibitem format
- Validate the output structure
- Display conversion results


## ⚙️ Requirements

### Python CLI
- Python 3.7+
- bibtexparser 1.4.3
- pyparsing 3.1.4

### Web Application
- Modern web browser with JavaScript enabled
- No installation required!

## 🔗 Links

- **Live Demo**: [https://imranpollob.github.io/BibTeX-to-Bibitem/](https://imranpollob.github.io/BibTeX-to-Bibitem/)
- **Repository**: [https://github.com/imranpollob/BibTeX-to-Bibitem](https://github.com/imranpollob/BibTeX-to-Bibitem)
- **Issues**: [https://github.com/imranpollob/BibTeX-to-Bibitem/issues](https://github.com/imranpollob/BibTeX-to-Bibitem/issues)

---

<div align="center">
Made with ❤️ for the LaTeX community
</div>
