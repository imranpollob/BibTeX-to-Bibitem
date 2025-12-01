"""
Test script for BibTeX to Bibitem converter.

This script tests the conversion functionality with sample BibTeX entries
and validates the output format.
"""

import tempfile
import os
from script import load_bib_file, convert_to_bibitem


def create_test_bib_file():
    """Create a temporary .bib file with test entries."""
    test_content = """
@article{einstein1905does,
  title={Does the inertia of a body depend upon its energy-content?},
  author={Einstein, Albert},
  journal={Annalen der Physik},
  volume={18},
  number={13},
  pages={639--641},
  year={1905},
  publisher={Wiley Online Library}
}

@inproceedings{turing1950computing,
  title={Computing machinery and intelligence},
  author={Turing, Alan M},
  booktitle={Mind},
  pages={433--460},
  year={1950}
}

@book{knuth1984texbook,
  title={The texbook},
  author={Knuth, Donald E},
  year={1984},
  publisher={Addison-Wesley}
}
"""
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(
        mode="w", suffix=".bib", delete=False, encoding="utf-8"
    )
    temp_file.write(test_content)
    temp_file.close()
    return temp_file.name


def test_conversion():
    """Run the conversion test."""
    print("=" * 60)
    print("BibTeX to Bibitem Converter - Test Script")
    print("=" * 60)
    print()

    # Create test file
    print("Creating test BibTeX file...")
    test_file = create_test_bib_file()
    print(f"✓ Test file created: {test_file}")
    print()

    try:
        # Load entries
        print("Loading BibTeX entries...")
        entries = load_bib_file(test_file)
        print(f"✓ Loaded {len(entries)} entries")
        print()

        # Convert to bibitems
        print("Converting to bibitem format...")
        bibitems = convert_to_bibitem(entries)
        print(f"✓ Converted {len(bibitems)} entries")
        print()

        # Display results
        print("=" * 60)
        print("CONVERSION RESULTS")
        print("=" * 60)
        print()
        for i, bibitem in enumerate(bibitems, 1):
            print(f"Entry {i}:")
            print("-" * 60)
            print(bibitem)
            print()

        # Validate output format
        print("=" * 60)
        print("VALIDATION")
        print("=" * 60)
        print()

        all_valid = True
        for i, bibitem in enumerate(bibitems, 1):
            checks = {
                "Starts with \\bibitem": bibitem.strip().startswith("\\bibitem{"),
                "Contains author": len(bibitem.split("\n")[1].strip()) > 0,
                "Contains title": "\\newblock" in bibitem,
            }

            entry_valid = all(checks.values())
            all_valid = all_valid and entry_valid

            status = "✓ PASS" if entry_valid else "✗ FAIL"
            print(f"Entry {i}: {status}")
            for check_name, check_result in checks.items():
                symbol = "✓" if check_result else "✗"
                print(f"  {symbol} {check_name}")
            print()

        if all_valid:
            print("=" * 60)
            print("✓ ALL TESTS PASSED!")
            print("=" * 60)
        else:
            print("=" * 60)
            print("✗ SOME TESTS FAILED")
            print("=" * 60)

    finally:
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)
            print()
            print(f"Cleaned up test file: {test_file}")


if __name__ == "__main__":
    test_conversion()
