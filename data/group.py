'''
Group permission data
'''
reconstruction_groups = ['Tracker', 'Ecal', 'HGcal', 'Hcal', 'CASTOR', 'DT', 'CSC', 'RPC', 'GEM',
    'MTD', 'PPS', 'L1', 'Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau',
    'PF'
]
hlt_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau', 'SMP',
    'Higgs', 'Top', 'NPS', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN'
]
pags_groups = ['SMP', 'Higgs', 'Top', 'NPS', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN']
hin_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet']
gen_groups = ['GEN']

group = {
    'Reconstruction': {
        'Data': reconstruction_groups,
        'FastSim': reconstruction_groups,
        'FullSim': reconstruction_groups,
    },
    'HLT': {
        'Data': hlt_groups,
        'FullSim': hlt_groups,
    },
    'PAGs': {
        'Data': pags_groups,
        'FastSim': pags_groups,
        'FullSim': pags_groups,
    },
    'HIN': {
        'Data': hin_groups,
        'FullSim': hin_groups,
    },
    'GEN': {
        'Gen': gen_groups,
    }
}

def get_all_groups():
    '''
    Get list of all groups in the system
    '''
    groups = []
    for category_name, category in group.items():
        for subcategory_name, subcategory in category.items():
            for group_name in subcategory:
                groups.append(f"{category_name}.{subcategory_name}.{group_name}")
    return groups
