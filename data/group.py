recontruction_groups = ['Tracker', 'Ecal', 'HGcal', 'Hcal', 'CASTOR', 'DT', 'CSC', 'RPC', 'GEM', 'MTD', 'PPS', 'L1', 'Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau', 'PF', 'Info', 'RelMon']
hlt_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'MET', 'bTag', 'Tau', 'SMP', 'Higgs', 'Top', 'Susy', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN', 'Info', 'RelMon']
pags_groups = ['SMP', 'Higgs', 'Top', 'Susy', 'Exotica', 'B2G', 'B', 'Fwd', 'HIN', 'Info', 'RelMon']
hin_groups = ['Tracking', 'Electron', 'Photon', 'Muon', 'Jet', 'Info', 'RelMon']
gen_groups = ['GEN', 'Info', 'RelMon']

group = {
    'Reconstruction': {
        'Data': recontruction_groups,
        'FastSim': recontruction_groups,
        'FullSim': recontruction_groups,
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

# groups = [
#     {
#         "name": "Reconstruction",
#         "subcategories": [
#             {
#                 "name": "Data",
#                 "groups": recontruction_groups,
#             },
#             {
#                 "name": "FastSim",
#                 "groups": recontruction_groups,
#             },
#             {
#                 "name": "FullSim",
#                 "groups": recontruction_groups,
#             },
            
#         ]
#     },
#     {
#         "name": "HLT",
#         "subcategories": [
#             {
#                 "name": "Data",
#                 "groups": hlt_groups,
#             },
#             {
#                 "name": "FullSim",
#                 "groups": hlt_groups,
#             },
            
#         ]
#     },
#     {
#         "name": "PAGs",
#         "subcategories": [
#             {
#                 "name": "Data",
#                 "groups": pags_groups,
#             },
#             {
#                 "name": "FastSim",
#                 "groups": pags_groups,
#             },
#             {
#                 "name": "FullSim",
#                 "groups": pags_groups,
#             },
            
#         ]
#     },
#     {
#         "name": "HIN",
#         "subcategories": [
#             {
#                 "name": "Data",
#                 "groups": hin_groups,
#             },
#             {
#                 "name": "FullSim",
#                 "groups": hin_groups,
#             },
            
#         ]
#     },
#     {
#         "name": "GEN",
#         "subcategories": [
#             {
#                 "name": "Gen",
#                 "groups": gen_groups,
#             },
#         ]
#     },
# ]