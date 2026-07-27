import json
from collections import Counter
m={x['sid']:x for x in json.load(open('intervention-coverage/generated/c1_statements.json'))}
pe=json.load(open('intervention-coverage/generated/pe_assignment.json'))['assigned']

# Coverage code + destination per SID. Codes: A remain, B existing technique, C additional technique,
# D recognition, E outside-scope(R3/clinical), F insufficient.
COV={
# ---- PE-1 (28) ----
'STM-0143':('B','F1-T1a bounded reflection'),'STM-0012':('B','F1-T1a'),'STM-0007':('B','F1-T1a'),
'STM-0145':('B','F1-T1a'),'STM-0149':('B','F1-T1a'),'STM-0151':('C','F1-T1b pattern re-scope'),
'STM-0154':('C','F1-T1b'),'STM-0159':('B','F1-T1a'),'STM-0268':('B','F1-T1a'),
'STM-0270':('C','F1-T1b'),'STM-0155':('B','F1-T1a + edu'),'STM-0144':('E','R3 entrenched worth'),
'STM-0156':('E','R3 entrenched (broken)'),
'STM-0010':('B','F1-T1a (controllability guardrail)'),'STM-0011':('B','F1-T1a'),'STM-0140':('B','F1-T1a'),
'STM-0141':('B','F1-T1a'),'STM-0142':('B','F1-T1a'),'STM-0252':('B','F1-T1a'),'STM-0253':('B','F1-T1a'),
'STM-0254':('B','F1-T1a'),'STM-0255':('B','F1-T1a'),
'STM-0008':('D','recognition + edu (comparative)'),'STM-0020':('D','recognition + edu'),
'STM-0269':('D','recognition + edu'),'STM-0158':('A','envy — may remain'),
'STM-0157':('D','recognition (wish)'),'STM-0182':('D','recognition/edu'),
# ---- PE-2 (13) ----
'STM-0002':('C','F1-T1c mutual-fit/evaluator'),'STM-0001':('D','recognition (why single)'),
'STM-0146':('B','F1-T1c/T1a (backup)'),'STM-0147':('B','F1-T1c'),'STM-0148':('B','F1-T1c'),
'STM-0150':('A','wish to be chosen — may remain'),'STM-0265':('B','F1-T1c (replaceable)'),
'STM-0266':('A','feel special — may remain/D'),'STM-0271':('A','feel invisible — may remain'),
'STM-0440':('C','F1-T1c (waiting-to-be-chosen frame)'),'STM-0003':('A','feel invisible — may remain'),
'STM-0013':('D','recognition (nobody stays interested)'),'STM-0259':('B','F1-T1a (why lose interest)'),
# ---- PE-3 (5) ----
'STM-0262':('B','F3-T3a authentic experiment'),'STM-0263':('B','F3-T3a'),
'STM-0153':('B','F1-T1a + F3-T3a (earn love belief)'),'STM-0260':('B','F1-T1a + F3-T3a (perfect to be loved)'),
'STM-0261':('C','edu/R2 (identity outside relationships)'),
# ---- PE-4 (5) ----
'STM-0256':('B','F2-T2c investment-pacing'),'STM-0257':('B','F2-T2c'),'STM-0267':('B','F2-T2c'),
'STM-0258':('A','attach quickly — feeling may remain'),'STM-0264':('A','wish to stop caring — may remain'),
# ---- PE-5 (8) ----
'STM-0436':('B','F2-T2a evidence discrimination'),'STM-0437':('B','F2-T2a (other-person behavior)'),
'STM-0438':('B','F2-T2a'),'STM-0439':('B','F2-T2a'),'STM-0441':('C','F2-T2b decision rule (indefinite waiting)'),
'STM-0443':('C','F2-T2b (when to walk away)'),'STM-0442':('B','F2-T2a/T2d (hoping change mind)'),
'STM-0181':('C','F2-T2d expectation-calibration (dont believe people)'),
# ---- PE-6 (14) ----
'STM-0180':('C','F2-T2d expectation-calibration (if distorted)'),'STM-0529':('C','F2-T2d'),
'STM-0530':('C','F2-T2d'),'STM-0528':('C','F2-T2d'),'STM-0527':('C','F2-T2d'),
'STM-0174':('C','F2-T2d/T1b (every relationship ends same — pattern)'),
'STM-0524':('C','F2-T2d/T1b'),'STM-0522':('A','thought theyd be different — may remain/D'),
'STM-0523':('A','getting hopes up — feeling may remain'),'STM-0525':('A','tired of disappointment — feeling'),
'STM-0526':('D','edu (hope without hurt = uncertainty tolerance)'),
'STM-0531':('D','edu (enjoy without worry = uncertainty tolerance)'),
'STM-0179':('A','afraid to hope — fear may remain'),'STM-0184':('A','afraid end up alone — fear may remain'),
# ---- PE-7 (9) ----
'STM-0177':('B','F4-T4a intentional engagement (apps)'),'STM-0176':('B','F4-T4a (not excited)'),
'STM-0172':('A','tired of trying — feeling may remain'),'STM-0173':('A','exhausted — feeling'),
'STM-0175':('A','losing hope — feeling'),'STM-0178':('A','burned out — feeling'),
'STM-0009':('A','defeated — feeling'),'STM-0152':('A','tired of proving worth — feeling (→F1 if globalizes)'),
'STM-0183':('B','F2-T2c/F4 (investing in people who leave)'),
# ---- PE-8 (19) ----
'STM-0563':('D','recognition'),'STM-0564':('D','recognition'),'STM-0565':('D','recognition'),
'STM-0566':('D','recognition'),'STM-0567':('D','recognition'),'STM-0568':('D','recognition'),
'STM-0569':('D','recognition'),'STM-0570':('D','recognition'),'STM-0571':('D','recognition'),
'STM-0572':('D','recognition'),'STM-0004':('D','recognition (always rejected exp)'),
'STM-0005':('D','recognition'),'STM-0006':('D','recognition'),'STM-0014':('D','recognition'),
'STM-0015':('D','recognition/edu (behind everyone — temporal)'),'STM-0016':('D','recognition'),
'STM-0017':('D','recognition'),'STM-0018':('D','recognition/edu'),'STM-0019':('D','recognition/edu'),
}
miss=set(m)-set(COV); extra=set(COV)-set(m)
print('N',len(m),'assigned',len(COV),'MISSING',sorted(miss),'EXTRA',sorted(extra))
print('CODE DIST:',dict(Counter(v[0] for v in COV.values())))
out=[]
for sid,x in m.items():
    c,dest=COV.get(sid,('F','?'))
    out.append({'sid':sid,'statement':x['statement'],'type':x['type'],'PE':pe[sid].split(' ')[0],
                'code':c,'destination':dest})
json.dump(out, open('cluster1-intervention-development/generated_coverage_matrix.json','w'), indent=1)
print('wrote generated_coverage_matrix.json')
