#!/usr/bin/env python3
"""Statement-bank count reconciliation (Change System Final v1, adjudication §20).
Authoritative source: _import/RLC_Experience_Clusters.xlsx -> sheet 'Full Statement Mapping'.
Read-only. Run from repo root."""
import openpyxl, os
from collections import Counter
SRC = os.path.join('_import', 'RLC_Experience_Clusters.xlsx')
ws = openpyxl.load_workbook(SRC, data_only=True)['Full Statement Mapping']
rows = [r for r in list(ws.iter_rows(values_only=True))[1:] if r and r[0] and str(r[0]).strip()]
texts = [str(r[0]).strip().lower() for r in rows]
print('Authoritative source :', SRC, '| sheet: Full Statement Mapping')
print('Mapping rows (sids)   :', len(rows))                 # 1085
print('Unique statement texts:', len(set(texts)))           # 1058
print('Cross-mapped texts    :', sum(1 for _,c in Counter(texts).items() if c>1),
      '(', len(rows)-len(set(texts)), 'extra rows )')        # 24 texts / 27 extra rows
print('Rows without cluster# :', sum(1 for r in rows if not r[4] or not str(r[4]).strip()))  # 0
print('Cluster 1 rows        :', sum(1 for r in rows if str(r[4]).strip() in ('1','1.0')))
print("Brief figure 1,069    : NOT reproducible from this source by any single filter (track/reassignment/dedup).")
