import json
m={x['sid']:x for x in json.load(open('generated/c1_statements.json'))}
PE={
'PE-1 Self-worth conclusion from relational outcomes':[
 'STM-0007','STM-0010','STM-0011','STM-0012','STM-0143','STM-0144','STM-0145','STM-0149','STM-0151','STM-0154','STM-0155','STM-0156','STM-0159','STM-0268','STM-0270','STM-0269','STM-0008','STM-0020','STM-0140','STM-0141','STM-0142','STM-0252','STM-0253','STM-0254','STM-0255','STM-0157','STM-0182','STM-0158'],
'PE-2 Self-evaluation organized around being selected':[
 'STM-0001','STM-0002','STM-0146','STM-0147','STM-0148','STM-0150','STM-0265','STM-0266','STM-0271','STM-0440','STM-0003','STM-0013','STM-0259'],
'PE-3 Performing / self-editing to be chosen':[
 'STM-0153','STM-0260','STM-0261','STM-0263','STM-0262'],
'PE-4 Over-investment relative to the other person':[
 'STM-0256','STM-0257','STM-0258','STM-0264','STM-0267'],
'PE-5 Difficulty reading relational evidence and deciding':[
 'STM-0436','STM-0437','STM-0438','STM-0439','STM-0441','STM-0443','STM-0442','STM-0181'],
'PE-6 Protective negative expectancy (hope-disappointment cycle)':[
 'STM-0180','STM-0179','STM-0184','STM-0522','STM-0523','STM-0524','STM-0525','STM-0526','STM-0527','STM-0528','STM-0529','STM-0530','STM-0531','STM-0174'],
'PE-7 Discouragement and dating withdrawal (burnout)':[
 'STM-0009','STM-0152','STM-0172','STM-0173','STM-0175','STM-0176','STM-0178','STM-0183','STM-0177'],
'PE-8 Loneliness / companionship longing':[
 'STM-0004','STM-0005','STM-0006','STM-0014','STM-0015','STM-0016','STM-0017','STM-0018','STM-0019','STM-0563','STM-0564','STM-0565','STM-0566','STM-0567','STM-0568','STM-0569','STM-0570','STM-0571','STM-0572'],
}
allids=set(m); assigned={}
dup=[]
for pe,ids in PE.items():
    for i in ids:
        if i in assigned: dup.append(i)
        assigned[i]=pe
missing=allids-set(assigned); extra=set(assigned)-allids
print('TOTAL',len(allids),'ASSIGNED',len(assigned),'DUP',dup,'MISSING',sorted(missing),'EXTRA',sorted(extra))
print('\nCOUNTS:')
for pe,ids in PE.items(): print(f'  {len(ids):3d}  {pe}')
json.dump({'PE':PE,'assigned':assigned}, open('generated/pe_assignment.json','w'), indent=1)
