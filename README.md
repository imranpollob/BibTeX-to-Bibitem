# Convert BibTeX to Bibitem Format

Maintaining the bibliography in a separate `.bib` file is easier to handle, but some conferences and journals (such as Elsevier, based on my last test) do not support separate `.bib` files. Instead, they require a single `.tex` file that includes the references directly.  

If you maintain your references in a `.bib` file and need to embed them in your main `.tex` file, you can use this Python script to automate the conversion.

## Conversion

First, ensure your `.bib` file contents are copied into `references.bib`. Then, run the following command:

```bash
python script.py
```

## Sample Conversion

**Input (`references.bib`):**
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

**Output (`bibitems.txt`):**
```latex
\bibitem{lahat2015multimodal}
Lahat, Dana, Adali, Tülay, Jutten, Christian.
\newblock Multimodal data fusion: an overview of methods, challenges, and prospects.
\newblock \emph{Proceedings of the IEEE}, 103(9):1449--1477, 2015.
```

## LaTeX Template

Below is an example LaTeX template using the converted bibliography entries:

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

\end{thebibliography}

\end{document}
```

## Notes
- This script helps convert `.bib` entries into `\bibitem` format to comply with publication requirements that do not allow separate bibliography files.
- The generated `\bibitem` entries maintain proper formatting for journals, conferences (`booktitle` field), and books.
- Ensure that your LaTeX document uses the correct citation style (`natbib` with `numbers` or any other required format).

