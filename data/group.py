reconstruction_groups = ['Tracker', 'Ecal', 'HGcal', 'Hcal', 'CASTOR', 'DT', 'CSC', 'RPC', 'GEM',
    'MTD', 'PPS', 'L1', 'Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau',
    'PF', 'Info', 'RelMon'
]
hlt_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau', 'SMP',
    'Higgs', 'Top', 'Susy', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN', 'Info', 'RelMon'
]
pags_groups = ['SMP', 'Higgs', 'Top', 'Susy', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN', 'Info',
    'RelMon'
]
hin_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'Info', 'RelMon']
gen_groups = ['GEN', 'Info', 'RelMon']

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
