# Repository Map: mind-platform

*Generated: 2025-12-30 00:02*

- **Files:** 458
- **Directories:** 129
- **Total Size:** 2.5M
- **Doc Files:** 398
- **Code Files:** 57
- **Areas:** 11 (docs/ subfolders)
- **Modules:** 16 (subfolders in areas)
- **DOCS Links:** 15 (0.26 avg per code file)

- markdown: 398
- python: 24
- tsx: 19
- typescript: 12
- css: 2

```
├── app/ (94.3K)
│   ├── (dashboard)/ (244)
│   │   ├── citizen/ (62)
│   │   │   └── (..1 more files)
│   │   ├── membrane/ (63)
│   │   │   └── (..1 more files)
│   │   ├── org/ (58)
│   │   │   └── (..1 more files)
│   │   └── wallet/ (61)
│   │       └── (..1 more files)
│   ├── (public)/ (28.0K)
│   │   ├── components/ (18.6K)
│   │   │   ├── landing/ (12.2K)
│   │   │   │   ├── ActionCard.tsx (652)
│   │   │   │   ├── GraphPreview.tsx (3.4K)
│   │   │   │   ├── Hero.tsx (1.5K)
│   │   │   │   ├── HowItWorks.tsx (1.3K)
│   │   │   │   ├── LayerCard.tsx (787)
│   │   │   │   ├── LiveStats.tsx (839)
│   │   │   │   ├── StatCounter.tsx (1.0K)
│   │   │   │   └── WhatYouCanDo.tsx (2.7K)
│   │   │   └── nav/ (6.4K)
│   │   │       ├── Footer.tsx (3.5K)
│   │   │       ├── TopNav.tsx (2.8K)
│   │   │       └── (..1 more files)
│   │   ├── docs/
│   │   │   └── (..1 more files)
│   │   ├── marketplace/ (66)
│   │   │   └── (..1 more files)
│   │   ├── registry/ (8.4K)
│   │   │   ├── components/ (4.3K)
│   │   │   │   ├── EntityCard.tsx (1.3K)
│   │   │   │   ├── EntityList.tsx (881)
│   │   │   │   ├── RegistryTabs.tsx (1.3K)
│   │   │   │   └── VerificationBadge.tsx (854)
│   │   │   ├── lib/ (2.1K)
│   │   │   │   ├── api.ts (1.2K)
│   │   │   │   └── types.ts (864)
│   │   │   └── page.tsx (2.0K) →
│   │   ├── schema/ (61)
│   │   │   └── (..1 more files)
│   │   ├── page.tsx (531) →
│   │   └── (..1 more files)
│   ├── api/ (5.9K)
│   │   ├── connectome/ (3.3K)
│   │   │   ├── graph/ (903)
│   │   │   │   └── route.ts (903)
│   │   │   ├── graphs/ (702)
│   │   │   │   └── route.ts (702)
│   │   │   ├── search/ (1.2K)
│   │   │   │   └── route.ts (1.2K)
│   │   │   └── tick/ (429)
│   │   │       └── (..1 more files)
│   │   ├── sse/ (1.6K)
│   │   │   └── route.ts (1.6K)
│   │   └── stats/ (989)
│   │       └── route.ts (989)
│   ├── connectome/ (58.8K)
│   │   ├── components/ (35.3K)
│   │   │   ├── connectome_page_shell_route_layout_and_control_surface.tsx (13.8K) →
│   │   │   └── pannable_zoomable_zoned_flow_canvas_renderer.tsx (21.5K) →
│   │   ├── lib/ (16.6K)
│   │   │   ├── connectome_system_map_node_edge_manifest.ts (3.6K)
│   │   │   ├── next_step_gate_and_realtime_playback_runtime_engine.ts (3.1K)
│   │   │   └── zustand_connectome_state_store_with_atomic_commit_actions.ts (10.0K)
│   │   ├── connectome.css (6.3K)
│   │   └── (..2 more files)
│   ├── globals.css (642)
│   └── layout.tsx (728) →
├── capabilities/ (717.2K)
│   ├── add-tests/ (57.0K)
│   │   ├── runtime/ (8.3K)
│   │   │   ├── checks.py (8.1K)
│   │   │   └── (..1 more files)
│   │   ├── skills/ (3.1K)
│   │   │   └── SKILL_write_tests.md (3.1K)
│   │   ├── tasks/ (6.0K)
│   │   │   ├── TASK_add_tests.md (1.3K)
│   │   │   ├── TASK_add_validates_markers.md (1.7K)
│   │   │   ├── TASK_fix_health.md (1.8K)
│   │   │   └── TASK_test_invariant.md (1.4K)
│   │   ├── ALGORITHM.md (9.2K)
│   │   ├── BEHAVIORS.md (4.2K)
│   │   ├── HEALTH.md (6.3K)
│   │   ├── IMPLEMENTATION.md (5.7K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.4K)
│   │   ├── SYNC.md (2.8K)
│   │   ├── VALIDATION.md (3.6K)
│   │   └── VOCABULARY.md (3.3K)
│   ├── create-doc-chain/ (43.5K)
│   │   ├── runtime/ (7.0K)
│   │   │   ├── checks.py (6.7K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.8K)
│   │   │   ├── SKILL_fix_drift.md (1.6K)
│   │   │   └── SKILL_write_doc.md (1.3K)
│   │   ├── tasks/ (2.6K)
│   │   │   ├── TASK_create_doc.md (1.3K)
│   │   │   └── TASK_fix_template_drift.md (1.3K)
│   │   ├── ALGORITHM.md (5.7K)
│   │   ├── BEHAVIORS.md (3.2K)
│   │   ├── HEALTH.md (5.9K)
│   │   ├── IMPLEMENTATION.md (3.9K)
│   │   ├── OBJECTIVES.md (1.9K)
│   │   ├── PATTERNS.md (1.9K)
│   │   ├── SYNC.md (2.3K)
│   │   ├── VALIDATION.md (2.8K)
│   │   └── VOCABULARY.md (3.4K)
│   ├── derive-tasks/ (42.1K)
│   │   ├── runtime/ (10.4K)
│   │   │   ├── checks.py (10.1K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (1.9K)
│   │   │   └── SKILL_decompose_objective.md (1.9K)
│   │   ├── tasks/ (2.5K)
│   │   │   ├── TASK_assess_objective.md (1.1K)
│   │   │   └── TASK_derive_tasks.md (1.4K)
│   │   ├── ALGORITHM.md (5.7K)
│   │   ├── BEHAVIORS.md (2.5K)
│   │   ├── HEALTH.md (5.7K)
│   │   ├── IMPLEMENTATION.md (2.8K)
│   │   ├── OBJECTIVES.md (2.1K)
│   │   ├── PATTERNS.md (2.5K)
│   │   ├── SYNC.md (1.5K)
│   │   ├── VALIDATION.md (2.2K)
│   │   └── VOCABULARY.md (2.3K)
│   ├── fill-gaps/ (53.3K)
│   │   ├── runtime/ (6.9K)
│   │   │   ├── checks.py (6.7K)
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.5K)
│   │   │   └── SKILL_fill_gaps.md (2.5K)
│   │   ├── tasks/ (4.8K)
│   │   │   ├── TASK_dedupe_content.md (1.7K)
│   │   │   ├── TASK_fill_gap.md (1.5K)
│   │   │   └── TASK_split_large_doc.md (1.7K)
│   │   ├── ALGORITHM.md (10.4K)
│   │   ├── BEHAVIORS.md (4.1K)
│   │   ├── HEALTH.md (5.1K)
│   │   ├── IMPLEMENTATION.md (5.9K)
│   │   ├── OBJECTIVES.md (2.1K)
│   │   ├── PATTERNS.md (2.4K)
│   │   ├── SYNC.md (2.7K)
│   │   ├── VALIDATION.md (3.5K)
│   │   └── VOCABULARY.md (2.8K)
│   ├── fix-membrane/ (52.9K)
│   │   ├── runtime/ (7.2K)
│   │   │   ├── checks.py (6.9K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.4K)
│   │   │   └── SKILL_fix_procedure.md (2.4K)
│   │   ├── tasks/ (7.7K)
│   │   │   ├── TASK_add_missing_fields.md (2.0K)
│   │   │   ├── TASK_create_procedures.md (1.6K)
│   │   │   ├── TASK_fix_step_structure.md (2.1K)
│   │   │   └── TASK_fix_yaml_syntax.md (1.9K)
│   │   ├── ALGORITHM.md (9.0K)
│   │   ├── BEHAVIORS.md (3.6K)
│   │   ├── HEALTH.md (5.2K)
│   │   ├── IMPLEMENTATION.md (4.8K)
│   │   ├── OBJECTIVES.md (2.0K)
│   │   ├── PATTERNS.md (2.2K)
│   │   ├── SYNC.md (2.7K)
│   │   ├── VALIDATION.md (2.9K)
│   │   └── VOCABULARY.md (3.3K)
│   ├── flag-errors/ (46.8K)
│   │   ├── runtime/ (11.0K)
│   │   │   ├── checks.py (10.7K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.5K)
│   │   │   └── SKILL_triage_error.md (2.5K)
│   │   ├── tasks/ (3.4K)
│   │   │   ├── TASK_configure_watch.md (1.3K)
│   │   │   └── TASK_investigate_error.md (2.1K)
│   │   ├── ALGORITHM.md (4.7K)
│   │   ├── BEHAVIORS.md (2.5K)
│   │   ├── HEALTH.md (6.9K)
│   │   ├── IMPLEMENTATION.md (3.9K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.5K)
│   │   ├── SYNC.md (2.3K)
│   │   ├── VALIDATION.md (2.6K)
│   │   └── VOCABULARY.md (2.4K)
│   ├── implement-code/ (66.5K)
│   │   ├── runtime/ (13.3K)
│   │   │   ├── checks.py (13.1K)
│   │   │   └── (..1 more files)
│   │   ├── skills/ (3.4K)
│   │   │   └── SKILL_implement.md (3.4K)
│   │   ├── tasks/ (6.3K)
│   │   │   ├── TASK_complete_impl.md (1.5K)
│   │   │   ├── TASK_document_impl.md (1.6K)
│   │   │   ├── TASK_implement_stub.md (1.5K)
│   │   │   └── TASK_update_impl_docs.md (1.7K)
│   │   ├── ALGORITHM.md (11.9K)
│   │   ├── BEHAVIORS.md (5.0K)
│   │   ├── HEALTH.md (7.0K)
│   │   ├── IMPLEMENTATION.md (4.7K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.7K)
│   │   ├── SYNC.md (2.8K)
│   │   ├── VALIDATION.md (3.6K)
│   │   └── VOCABULARY.md (3.6K)
│   ├── improve-quality/ (72.3K)
│   │   ├── runtime/ (8.9K)
│   │   │   ├── __init__.py (553) →
│   │   │   └── checks.py (8.4K) →
│   │   ├── skills/ (3.8K)
│   │   │   └── SKILL_refactor.md (3.8K)
│   │   ├── tasks/ (12.0K)
│   │   │   ├── TASK_compress_prompt.md (2.1K)
│   │   │   ├── TASK_extract_constants.md (1.7K)
│   │   │   ├── TASK_extract_secrets.md (2.3K)
│   │   │   ├── TASK_fix_naming.md (2.1K)
│   │   │   ├── TASK_refactor_sql.md (2.1K)
│   │   │   └── TASK_split_monolith.md (1.8K)
│   │   ├── ALGORITHM.md (10.6K)
│   │   ├── BEHAVIORS.md (4.8K)
│   │   ├── HEALTH.md (8.4K)
│   │   ├── IMPLEMENTATION.md (6.2K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.6K)
│   │   ├── SYNC.md (2.8K)
│   │   ├── VALIDATION.md (4.6K)
│   │   └── VOCABULARY.md (5.4K)
│   ├── investigate-runtime/ (44.3K)
│   │   ├── runtime/ (6.8K)
│   │   │   ├── checks.py (6.6K)
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.0K)
│   │   │   └── SKILL_investigate.md (2.0K)
│   │   ├── tasks/ (3.0K)
│   │   │   ├── TASK_document_hook.md (1.4K)
│   │   │   └── TASK_investigate_error.md (1.6K)
│   │   ├── ALGORITHM.md (7.3K)
│   │   ├── BEHAVIORS.md (3.8K)
│   │   ├── HEALTH.md (3.8K)
│   │   ├── IMPLEMENTATION.md (5.1K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.2K)
│   │   ├── SYNC.md (2.5K)
│   │   ├── VALIDATION.md (3.2K)
│   │   └── VOCABULARY.md (2.4K)
│   ├── maintain-links/ (45.6K)
│   │   ├── runtime/ (6.0K)
│   │   │   ├── checks.py (5.8K)
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.5K)
│   │   │   └── SKILL_fix_links.md (2.5K)
│   │   ├── tasks/ (4.5K)
│   │   │   ├── TASK_fix_impl_link.md (2.3K)
│   │   │   └── TASK_fix_orphan_docs.md (2.2K)
│   │   ├── ALGORITHM.md (6.7K)
│   │   ├── BEHAVIORS.md (4.0K)
│   │   ├── HEALTH.md (4.8K)
│   │   ├── IMPLEMENTATION.md (4.5K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.2K)
│   │   ├── SYNC.md (2.5K)
│   │   ├── VALIDATION.md (3.0K)
│   │   └── VOCABULARY.md (2.8K)
│   ├── monitor-agents/ (29.3K)
│   │   ├── runtime/ (5.3K)
│   │   │   ├── checks.py (5.1K) →
│   │   │   └── (..1 more files)
│   │   ├── tasks/ (7.6K)
│   │   │   ├── TASK_cleanup_dead_agent.md (1.9K)
│   │   │   ├── TASK_investigate_health_failure.md (1.8K)
│   │   │   ├── TASK_log_stuck_agent.md (862)
│   │   │   ├── TASK_release_orphan_task.md (1.1K)
│   │   │   └── TASK_unstick_task.md (1.9K)
│   │   ├── ALGORITHM.md (3.4K)
│   │   ├── BEHAVIORS.md (2.2K)
│   │   ├── HEALTH.md (1.1K)
│   │   ├── IMPLEMENTATION.md (2.3K)
│   │   ├── OBJECTIVES.md (947)
│   │   ├── PATTERNS.md (1.5K)
│   │   ├── SYNC.md (869)
│   │   ├── VALIDATION.md (1.9K)
│   │   └── VOCABULARY.md (2.3K)
│   ├── solve-markers/ (52.5K)
│   │   ├── skills/ (3.7K)
│   │   │   └── SKILL_solve_markers.md (3.7K)
│   │   ├── tasks/ (8.1K)
│   │   │   ├── TASK_answer_question.md (2.0K)
│   │   │   ├── TASK_evaluate_proposition.md (2.1K)
│   │   │   ├── TASK_fix_legacy_marker.md (2.2K)
│   │   │   └── TASK_resolve_escalation.md (1.8K)
│   │   ├── ALGORITHM.md (10.8K)
│   │   ├── BEHAVIORS.md (4.1K)
│   │   ├── HEALTH.md (6.1K)
│   │   ├── IMPLEMENTATION.md (5.2K)
│   │   ├── OBJECTIVES.md (2.3K)
│   │   ├── PATTERNS.md (2.1K)
│   │   ├── SYNC.md (2.6K)
│   │   ├── VALIDATION.md (3.4K)
│   │   └── VOCABULARY.md (4.0K)
│   ├── steer-project/ (41.2K)
│   │   ├── runtime/ (9.8K)
│   │   │   ├── checks.py (9.5K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (1.8K)
│   │   │   └── SKILL_strategic_assessment.md (1.8K)
│   │   ├── tasks/ (3.5K)
│   │   │   ├── TASK_process_escalation.md (1.2K)
│   │   │   ├── TASK_steering_session.md (1.5K)
│   │   │   └── TASK_update_sync.md (915)
│   │   ├── ALGORITHM.md (5.4K)
│   │   ├── BEHAVIORS.md (2.4K)
│   │   ├── HEALTH.md (5.6K)
│   │   ├── IMPLEMENTATION.md (2.9K)
│   │   ├── OBJECTIVES.md (2.0K)
│   │   ├── PATTERNS.md (2.3K)
│   │   ├── SYNC.md (1.4K)
│   │   ├── VALIDATION.md (1.8K)
│   │   └── VOCABULARY.md (2.2K)
│   ├── sync-state/ (59.7K)
│   │   ├── runtime/ (12.6K)
│   │   │   ├── checks.py (12.2K) →
│   │   │   └── (..1 more files)
│   │   ├── skills/ (2.9K)
│   │   │   └── SKILL_update_sync.md (2.9K)
│   │   ├── tasks/ (7.4K)
│   │   │   ├── TASK_ingest_docs.md (1.8K)
│   │   │   ├── TASK_regenerate_yaml.md (1.6K)
│   │   │   ├── TASK_unblock_module.md (2.5K)
│   │   │   └── TASK_update_sync.md (1.5K)
│   │   ├── ALGORITHM.md (7.9K)
│   │   ├── BEHAVIORS.md (3.7K)
│   │   ├── HEALTH.md (6.0K)
│   │   ├── IMPLEMENTATION.md (5.3K)
│   │   ├── OBJECTIVES.md (2.2K)
│   │   ├── PATTERNS.md (2.4K)
│   │   ├── SYNC.md (2.6K)
│   │   ├── VALIDATION.md (3.5K)
│   │   └── VOCABULARY.md (3.2K)
│   └── system-health/ (10.0K)
│       ├── runtime/ (5.8K)
│       │   └── checks.py (5.8K) →
│       ├── tasks/ (1.5K)
│       │   ├── TASK_investigate_stuck_agent.md (620)
│       │   └── (..2 more files)
│       ├── HEALTH.md (1.5K)
│       └── VOCABULARY.md (1.1K)
├── docs/ (1.1M)
│   ├── capabilities/ (32.5K)
│   │   ├── ALGORITHM_Capabilities.md (6.8K)
│   │   ├── BEHAVIORS_Capabilities.md (3.3K)
│   │   ├── HEALTH_Capabilities.md (4.0K)
│   │   ├── IMPLEMENTATION_Capabilities.md (4.4K)
│   │   ├── OBJECTIVES_Capabilities.md (2.3K)
│   │   ├── PATTERNS_Capabilities.md (3.6K)
│   │   ├── SYNC_Capabilities.md (2.8K)
│   │   ├── VALIDATION_Capabilities.md (2.9K)
│   │   └── VOCABULARY_Capabilities.md (2.5K)
│   ├── capability-runtime/ (42.9K)
│   │   ├── ALGORITHM_Capability_Runtime.md (8.7K)
│   │   ├── BEHAVIORS_Capability_Runtime.md (3.2K)
│   │   ├── HEALTH_Capability_Runtime.md (5.4K)
│   │   ├── IMPLEMENTATION_Capability_Runtime.md (6.5K)
│   │   ├── OBJECTIVES_Capability_Runtime.md (2.3K)
│   │   ├── PATTERNS_Capability_Runtime.md (6.7K)
│   │   ├── SYNC_Capability_Runtime.md (4.3K)
│   │   └── VALIDATION_Capability_Runtime.md (5.8K)
│   ├── concepts/ (9.5K)
│   │   └── CONCEPT_AI_Human_Partnership.md (9.5K)
│   ├── connectome/ (603.3K)
│   │   ├── edge_kit/ (57.1K)
│   │   │   ├── ALGORITHM_Connectome_Edge_Kit_Edge_Rendering_Pulse_Shine_And_Label_Placement_Rules.md (4.0K)
│   │   │   ├── BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md (7.3K)
│   │   │   ├── HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md (7.3K)
│   │   │   ├── IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md (13.5K)
│   │   │   ├── OBJECTIVES_Edge_Kit_Goals.md (711)
│   │   │   ├── PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md (7.6K)
│   │   │   ├── SYNC_Connectome_Edge_Kit_Sync_Current_State.md (10.4K)
│   │   │   └── VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md (6.4K)
│   │   ├── event_model/ (43.6K)
│   │   │   ├── ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md (6.3K)
│   │   │   ├── BEHAVIORS_Connectome_Event_Model_Observable_Event_Stream_Effects.md (4.9K)
│   │   │   ├── HEALTH_Connectome_Event_Model_Runtime_Verification_And_Signal_Coverage.md (8.3K)
│   │   │   ├── IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md (10.7K)
│   │   │   ├── OBJECTIVES_Event_Model_Goals.md (723)
│   │   │   ├── PATTERNS_Connectome_Event_Model_Contract_And_Normalization_Patterns.md (6.2K)
│   │   │   ├── SYNC_Connectome_Event_Model_Sync_Current_State.md (1.6K)
│   │   │   └── VALIDATION_Connectome_Event_Model_Invariants_And_Error_Conditions.md (4.9K)
│   │   ├── feature_shell/ (1.8K)
│   │   │   └── OBJECTIVES_Connectome_Feature_Shell.md (1.8K)
│   │   ├── flow_canvas/ (64.7K)
│   │   │   ├── ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md (8.3K)
│   │   │   ├── BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md (4.5K)
│   │   │   ├── HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md (11.4K)
│   │   │   ├── IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md (12.6K)
│   │   │   ├── OBJECTIVES_Flow_Canvas_Goals.md (723)
│   │   │   ├── PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md (4.5K)
│   │   │   ├── SYNC_Connectome_Flow_Canvas_Sync_Current_State.md (17.4K)
│   │   │   └── VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md (5.4K)
│   │   ├── graph_api/ (12.9K)
│   │   │   ├── OBJECTIVES_Graph_API.md (1.4K)
│   │   │   ├── PATTERNS_Graph_API.md (5.0K)
│   │   │   └── SYNC_Graph_API.md (6.5K)
│   │   ├── graphs/ (18.0K)
│   │   │   ├── ALGORITHM_Proxying_Graph_Listing_CLI.md (3.7K)
│   │   │   ├── BEHAVIORS_Listing_Available_Connectome_Graphs.md (2.3K)
│   │   │   ├── IMPLEMENTATION_Connectome_Graph_Listing_API_Architecture.md (3.5K)
│   │   │   ├── OBJECTIVES_Connectome_Graphs.md (1.4K)
│   │   │   ├── PATTERNS_Connectome_Graphs.md (1.8K)
│   │   │   ├── SYNC_Connectome_Graphs_Sync_Current_State.md (1.4K)
│   │   │   └── VALIDATION_Connectome_Graph_Listing_Invariants.md (3.9K)
│   │   ├── health/ (13.6K)
│   │   │   ├── CONNECTOME_HEALTH_PAYLOAD.md (965)
│   │   │   ├── HEALTH_Connectome_Activity_Logging.md (4.3K)
│   │   │   ├── HEALTH_Connectome_Live_Signals.md (6.2K)
│   │   │   ├── INTEGRATION_NOTES.md (1.3K)
│   │   │   └── OBJECTIVES_Connectome_Health.md (837)
│   │   ├── health_panel/ (6.2K)
│   │   │   ├── OBJECTIVES_Connectome_Health_Panel_Metrics_Display_And_Realtime_Feedback.md (1.5K)
│   │   │   └── PATTERNS_Connectome_Health_Panel_Live_Monitoring_And_Invariants_Visualization.md (4.7K)
│   │   ├── log_panel/ (72.1K)
│   │   │   ├── ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md (11.9K)
│   │   │   ├── BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md (4.5K)
│   │   │   ├── HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md (15.4K)
│   │   │   ├── IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md (12.3K)
│   │   │   ├── OBJECTIVES_Log_Panel_Goals.md (715)
│   │   │   ├── PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md (6.1K)
│   │   │   ├── SYNC_Connectome_Log_Panel_Sync_Current_State.md (15.5K)
│   │   │   └── VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md (5.6K)
│   │   ├── node_kit/ (84.1K)
│   │   │   ├── ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md (10.1K)
│   │   │   ├── BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md (4.7K)
│   │   │   ├── HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md (21.2K)
│   │   │   ├── IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md (13.2K)
│   │   │   ├── OBJECTIVES_Node_Kit_Goals.md (711)
│   │   │   ├── PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md (7.2K)
│   │   │   ├── SYNC_Connectome_Node_Kit_Sync_Current_State.md (4.3K)
│   │   │   ├── SYNC_Connectome_Node_Kit_Sync_Current_State_archive_2025-12.md (15.6K)
│   │   │   └── VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md (7.0K)
│   │   ├── page_shell/ (13.5K)
│   │   │   ├── ALGORITHM_Connectome_Page_Shell_Control_Dispatch_And_Layout_Composition.md (1.0K)
│   │   │   ├── BEHAVIORS_Connectome_Page_Shell_Stable_Workflow_And_Mode_Control_Effects.md (1.1K)
│   │   │   ├── HEALTH_Connectome_Page_Shell_Runtime_Verification_Of_Control_Semantics_And_Mode_Gating.md (1.1K)
│   │   │   ├── IMPLEMENTATION_Connectome_Page_Shell_Nextjs_Route_And_Component_Wiring.md (1.0K)
│   │   │   ├── OBJECTIVES_Page_Shell_Goals.md (719)
│   │   │   ├── PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md (5.4K)
│   │   │   ├── SYNC_Connectome_Page_Shell_Sync_Current_State.md (2.1K)
│   │   │   └── VALIDATION_Connectome_Page_Shell_Invariants_For_Control_Correctness_And_No_Drift.md (1.1K)
│   │   ├── runtime_engine/ (75.7K)
│   │   │   ├── ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md (6.6K)
│   │   │   ├── BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md (6.5K)
│   │   │   ├── HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md (16.4K)
│   │   │   ├── IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md (12.6K)
│   │   │   ├── OBJECTIVES_Runtime_Engine_Goals.md (735)
│   │   │   ├── PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md (11.7K)
│   │   │   ├── SYNC_Connectome_Runtime_Engine_Sync_Current_State.md (14.9K)
│   │   │   └── VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md (6.3K)
│   │   ├── search_api/ (10.5K)
│   │   │   ├── OBJECTIVES_Connectome_Search_API_Objectives.md (2.2K)
│   │   │   └── PATTERNS_Connectome_Search_API_Design_Patterns.md (8.3K)
│   │   ├── state_store/ (95.4K)
│   │   │   ├── ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md (10.1K)
│   │   │   ├── BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md (5.8K)
│   │   │   ├── HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md (33.4K)
│   │   │   ├── IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md (10.6K)
│   │   │   ├── OBJECTIVES_State_Store_Goals.md (723)
│   │   │   ├── PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md (8.9K)
│   │   │   ├── SYNC_Connectome_State_Store_Sync_Current_State.md (4.4K)
│   │   │   ├── SYNC_Connectome_State_Store_Sync_Current_State_archive_2025-12.md (15.8K)
│   │   │   └── VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md (5.7K)
│   │   ├── telemetry_adapter/ (24.7K)
│   │   │   ├── ALGORITHM_Connectome_Telemetry_Adapter_Sse_Subscription_Event_Parsing_And_Raw_Event_Emission.md (3.4K)
│   │   │   ├── BEHAVIORS_Connectome_Telemetry_Adapter_Realtime_Ingestion_Buffering_And_Backpressure_Effects.md (3.1K)
│   │   │   ├── HEALTH_Connectome_Telemetry_Adapter_Runtime_Verification_Of_Stream_Integrity_And_Buffer_Bounds.md (3.8K)
│   │   │   ├── IMPLEMENTATION_Connectome_Telemetry_Adapter_Code_Structure_For_Sse_And_Snapshot_Docking.md (4.2K)
│   │   │   ├── OBJECTIVES_Telemetry_Adapter_Goals.md (747)
│   │   │   ├── PATTERNS_Connectome_Telemetry_Adapter_Sse_To_FlowEvent_Normalization_Docking_Patterns.md (5.1K)
│   │   │   ├── SYNC_Connectome_Telemetry_Adapter_Sync_Current_State.md (1.4K)
│   │   │   └── VALIDATION_Connectome_Telemetry_Adapter_Invariants_For_No_Dropped_Events_And_Stable_Order.md (3.0K)
│   │   └── VISUAL_STYLEGUIDE_Connectome.md (9.7K)
│   ├── design-language/ (22.7K)
│   │   ├── IMPLEMENTATION_Design_Tokens.md (8.6K)
│   │   ├── OBJECTIVES_Design_Language_Goals.md (3.8K)
│   │   ├── PATTERNS_Design_Language_System.md (7.4K)
│   │   └── SYNC_Design_Language_State.md (2.9K)
│   ├── frontend/ (21.1K)
│   │   └── app_shell/ (21.1K)
│   │       ├── BEHAVIORS_App_Shell.md (3.3K)
│   │       ├── OBJECTIVES_App_Shell.md (2.2K)
│   │       ├── PATTERNS_App_Shell.md (7.8K)
│   │       └── SYNC_App_Shell_State.md (7.8K)
│   ├── landing/ (55.0K)
│   │   ├── ALGORITHM_Landing_Flows.md (7.2K)
│   │   ├── BEHAVIORS_Landing_UX.md (5.2K)
│   │   ├── HEALTH_Landing_Monitoring.md (4.5K)
│   │   ├── IMPLEMENTATION_Landing_Code.md (12.2K)
│   │   ├── OBJECTIVES_Landing_Goals.md (4.5K)
│   │   ├── PATTERNS_Landing_Design.md (11.4K)
│   │   ├── SYNC_Landing_State.md (4.9K)
│   │   └── VALIDATION_Landing_Invariants.md (5.0K)
│   ├── nature/ (24.2K)
│   │   ├── ALGORITHM_Nature.md (3.3K)
│   │   ├── BEHAVIORS_Nature.md (4.0K)
│   │   ├── HEALTH_Nature.md (1.9K)
│   │   ├── IMPLEMENTATION_Nature.md (1.6K)
│   │   ├── OBJECTIVES_Nature.md (2.1K)
│   │   ├── PATTERNS_Nature.md (2.6K)
│   │   ├── SYNC_Nature.md (2.0K)
│   │   ├── VALIDATION_Nature.md (2.5K)
│   │   └── VOCABULARY_Nature.md (4.2K)
│   ├── ngram_feature/ (15.7K)
│   │   ├── ALGORITHM_Ngram_Feature_Placeholder_Page.md (5.8K)
│   │   ├── BEHAVIORS_Ngram_Feature_Placeholder_Page.md (2.6K)
│   │   ├── OBJECTIVES_Ngram_Feature.md (530)
│   │   ├── PATTERNS_Ngram_Feature.md (696)
│   │   ├── SYNC_Ngram_Feature_State.md (1.2K)
│   │   └── VALIDATION_Ngram_Feature_Placeholder_Page.md (4.9K)
│   ├── registry/ (48.2K)
│   │   ├── ALGORITHM_Registry_Flows.md (7.5K)
│   │   ├── BEHAVIORS_Registry_UX.md (5.4K)
│   │   ├── HEALTH_Registry_Monitoring.md (5.6K)
│   │   ├── IMPLEMENTATION_Registry_Code.md (10.6K)
│   │   ├── OBJECTIVES_Registry_Goals.md (2.7K)
│   │   ├── PATTERNS_Registry_Design.md (5.2K)
│   │   ├── PATTERNS_Registry_Rules.md (3.2K)
│   │   ├── SYNC_Registry_State.md (3.7K)
│   │   └── VALIDATION_Registry_Invariants.md (4.3K)
│   ├── ux/ (15.3K)
│   │   ├── OBJECTIVES_UX_Goals.md (4.6K)
│   │   ├── PATTERNS_UX_Principles.md (7.9K)
│   │   └── SYNC_UX_State.md (2.8K)
│   ├── vision/ (57.0K)
│   │   ├── ALGORITHM_Platform_Flows.md (5.6K)
│   │   ├── BEHAVIORS_Platform_User_Experience.md (3.0K)
│   │   ├── HEALTH_Platform_Monitoring.md (6.2K)
│   │   ├── IMPLEMENTATION_Platform_Architecture.md (12.1K)
│   │   ├── OBJECTIVES_Platform_Goals.md (2.4K)
│   │   ├── PATTERNS_Platform_Vision_And_Architecture.md (10.6K)
│   │   ├── SYNC_Platform_Vision.md (5.6K)
│   │   ├── VALIDATION_Platform_Invariants.md (5.5K)
│   │   └── VOCABULARY_Platform_Terms.md (6.1K)
│   ├── ARCHITECTURE.md (4.6K)
│   └── map.md (188.9K)
├── l3/
│   ├── contributions/
│   │   └── (..2 more files)
│   └── federation/
│       └── (..2 more files)
├── lib/ (6.2K)
│   ├── constants/ (252)
│   │   └── (..1 more files)
│   ├── design/ (5.9K)
│   │   ├── theme.ts (4.7K)
│   │   ├── utils.ts (953)
│   │   └── (..1 more files)
│   └── (..1 more files)
├── runtime/ (57.6K)
│   ├── capability/ (57.5K)
│   │   ├── __init__.py (2.3K)
│   │   ├── agents.py (9.8K)
│   │   ├── context.py (2.1K)
│   │   ├── decorators.py (7.0K)
│   │   ├── dispatch.py (12.8K)
│   │   ├── graph_ops.py (11.0K)
│   │   ├── loader.py (3.3K)
│   │   ├── registry.py (3.0K)
│   │   └── throttler.py (6.3K)
│   └── (..1 more files)
├── templates/ (238.9K)
│   ├── actors/ (8.2K)
│   │   ├── ACTOR_Architect.md (883)
│   │   ├── ACTOR_Fixer.md (780)
│   │   ├── ACTOR_Groundwork.md (844)
│   │   ├── ACTOR_Herald.md (735)
│   │   ├── ACTOR_Keeper.md (805)
│   │   ├── ACTOR_Scout.md (785)
│   │   ├── ACTOR_Steward.md (837)
│   │   ├── ACTOR_Voice.md (804)
│   │   ├── ACTOR_Weaver.md (840)
│   │   └── ACTOR_Witness.md (910)
│   ├── docs/ (52.4K)
│   │   ├── ALGORITHM_TEMPLATE.md (2.7K)
│   │   ├── BEHAVIORS_TEMPLATE.md (2.9K)
│   │   ├── HEALTH_TEMPLATE.md (15.0K)
│   │   ├── IMPLEMENTATION_TEMPLATE.md (8.8K)
│   │   ├── MAPPING_TEMPLATE.md (2.7K)
│   │   ├── PATTERNS_TEMPLATE.md (2.9K)
│   │   ├── SYNC_TEMPLATE.md (3.1K)
│   │   ├── TAXONOMY_TEMPLATE.md (1.7K)
│   │   ├── VALIDATION_TEMPLATE.md (2.0K)
│   │   ├── VOCABULARY_TEMPLATE.md (4.0K)
│   │   └── (..6 more files)
│   ├── mcp/ (7.4K)
│   │   ├── CODEX_SYSTEM_ADDITION.md (3.2K)
│   │   ├── GEMINI_SYSTEM_ADDITION.md (2.4K)
│   │   ├── SYSTEM.md (1.3K)
│   │   └── (..1 more files)
│   ├── skills/ (123.3K)
│   │   ├── SKILL_Add_Cluster_Dynamic_Creation.md (26.3K)
│   │   ├── SKILL_Assess_SubEntity_Exploration_Quality_From_Logs.md (14.1K)
│   │   ├── SKILL_Author_Procedures_Design_And_Structure.md (20.5K)
│   │   ├── SKILL_Author_Skills_Structure_And_Quality.md (4.4K)
│   │   ├── SKILL_Author_agents_cognitive_posture.md (9.1K)
│   │   ├── SKILL_Create_Module_Documentation_Chain_From_Templates_And_Seed_Todos.md (3.4K)
│   │   ├── SKILL_Define_And_Verify_Health_Signals_Mapped_To_Validation_Invariants.md (3.7K)
│   │   ├── SKILL_Define_Module_Boundaries_Objectives_And_Scope.md (4.3K)
│   │   ├── SKILL_Ingest_Docs_To_Graph_And_Archive.md (4.3K)
│   │   ├── SKILL_Orchestrate_Feature_Integration_Pipeline_Orchestrator_And_Progress_Router.md (3.5K)
│   │   └── (..11 more files)
│   ├── state/ (6.9K)
│   │   ├── SYNC_Project_State.md (6.8K)
│   │   └── (..1 more files)
│   ├── FRAMEWORK.md (21.7K)
│   ├── PRINCIPLES.md (11.1K)
│   ├── SYSTEM.md (7.0K)
│   └── mindignore (839)
├── .mindignore (838)
├── AGENTS.md (29.8K)
├── README.md (3.3K)
├── map.md (188.9K)
├── map_app.md (6.8K)
└── tsconfig.tsbuildinfo (86.9K)
```

**Definitions:**
- `ActionCard()`

**Definitions:**
- `GraphPreview()`
- `resize()`
- `animate()`
- `generateNodes()`
- `generateEdges()`
- `updatePhysics()`
- `draw()`

**Definitions:**
- `Hero()`

**Definitions:**
- `HowItWorks()`

**Definitions:**
- `LayerCard()`

**Definitions:**
- `LiveStats()`

**Definitions:**
- `StatCounter()`

**Definitions:**
- `WhatYouCanDo()`

**Definitions:**
- `Footer()`

**Definitions:**
- `TopNav()`

**Definitions:**
- `EntityCard()`

**Definitions:**
- `EntityList()`

**Definitions:**
- `RegistryTabs()`

**Definitions:**
- `VerificationBadge()`

**Definitions:**
- `fetchCitizens()`
- `fetchOrgs()`

**Docs:** `docs/registry/IMPLEMENTATION_Registry_Code.md`

**Definitions:**
- `load()`

**Docs:** `docs/landing/IMPLEMENTATION_Landing_Code.md`

**Definitions:**
- `GET()`

**Definitions:**
- `GET()`

**Definitions:**
- `GET()`

**Definitions:**
- `GET()`

**Definitions:**
- `GET()`

**Docs:** `docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md`

**Definitions:**
- `connect()`
- `loadGraphs()`
- `loadGraph()`
- `runTick()`
- `handleNext()`
- `handleRestart()`
- `handleSpeedChange()`
- `handleModeChange()`
- `handleSearch()`
- `nodeIds()`
- `edgeIds()`

**Docs:** `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`

**Definitions:**
- `mapLabelToNodeType()`
- `CanvasInner()`
- `from()`
- `to()`
- `from()`
- `to()`
- `linkType()`
- `initFit()`
- `cx()`
- `cy()`
- `cx()`
- `cy()`
- `sx()`
- `sy()`
- `tx()`
- `ty()`
- `sx()`
- `sy()`
- `radius()`
- `sx()`
- `sy()`
- `handleWheel()`
- `handleMouseDown()`
- `handleMouseMove()`
- `worldX()`
- `worldY()`
- `handleMouseUp()`
- `handleClick()`
- `cx()`
- `cy()`
- `cx()`
- `cy()`

**Definitions:**
- `getEnergyBucket()`
- `formatEnergy()`

**Definitions:**
- `initialize_connectome_runtime()`
- `dispatch_runtime_command()`
- `releaseNextStep()`
- `release_next_step()`

**Definitions:**
- `generateSessionId()`
- `speedToMs()`
- `extractFocusFromEvent()`
- `extractExplanationFromEvent()`

**Docs:** `docs/frontend/app_shell/PATTERNS_App_Shell.md`

**Definitions:**
- `def test_coverage()`
- `def invariant_coverage()`
- `def validates_markers()`
- `def health_status()`

**Sections:**
- # Skill: write_tests
- ## Purpose
- ## Gates
- ## Process
- ## VALIDATES Marker Format
- # ... test code ...
- # Alternative: comment style
- # VALIDATES: V2
- # ... test code ...
- ## Tips
- ## Common Patterns
- ## Executes
- ## Used By

**Sections:**
- # Task: add_tests
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: add_validates_markers
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Process
- ## Instance (task_run)

**Sections:**
- # Task: fix_health
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Validation
- ## Process
- ## Escalation
- ## Instance (task_run)

**Sections:**
- # Task: test_invariant
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Add Tests — Algorithm
- ## CHAIN
- ## PURPOSE
- ## DETECTION ALGORITHM: MISSING_TESTS
- # 1. Find all code modules
- # Returns: ["auth", "utils", "api", ...]
- # 2. Find all test directories
- # Returns: {"auth": ["test_login.py", ...], ...}
- # MISSING_TESTS
- # Empty test directory
- ## DETECTION ALGORITHM: INVARIANT_UNTESTED
- # 1. Find all invariants in VALIDATION files
- # Returns: [{"id": "V1", "file": "docs/auth/VALIDATION.md"}, ...]
- # 2. Find all VALIDATES markers in tests
- # Returns: [{"invariant": "V1", "test_file": "tests/test_auth.py"}, ...]
- ## DETECTION ALGORITHM: TEST_NO_VALIDATES
- ## DETECTION ALGORITHM: HEALTH_FAILED
- # 1. Run the health check
- # 2. If failed, create problem
- ## TASK CREATION ALGORITHM
- # 1. Get task template based on problem type
- # 2. Determine nature based on severity
- # 3. Create task_run node
- # {task_map[problem['type']]}: {problem['target']}
- # 4. Create links
- ## EXECUTION ALGORITHM
- # 1. Load skill
- # 2. Start procedure
- # 3. Execute steps
- # 4. End procedure
- ## VALIDATION ALGORITHM
- # 1. Test file exists?
- # 2. Tests pass?
- # 3. VALIDATES markers present?
- # 4. Markers reference valid invariants?
- # 5. Result
- ## DECISION TREE

**Sections:**
- # Add Tests — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Missing Tests Detection
- ## B2: Untested Invariant Detection
- ## B3: Missing Marker Detection
- ## B4: Health Failure Response
- ## B5: Task Creation
- ## B6: Agent Pickup
- ## B7: Test Creation
- ## B8: Validation
- ## B9: Resolution Confirmation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Add Tests — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Sections:**
- # Add Tests — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/add-tests/runtime/checks.py
- # ... implementation
- # TASK_add_tests.md
- # TASK_test_invariant.md
- # TASK_add_validates_markers.md
- # TASK_fix_health.md
- # SKILL_write_tests.md
- ## Gates
- ## Process
- # PROCEDURE_add_tests.yaml
- ## INTEGRATION POINTS
- ## FLOWS

**Sections:**
- # Add Tests — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Add Tests — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Add Tests — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Add Tests — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Add Tests — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `docs/capability-runtime/IMPLEMENTATION.md`

**Definitions:**
- `def chain_completeness()`
- `def placeholder_detection()`
- `def template_drift()`
- `def new_undoc_code()`

**Sections:**
- # Skill: fix_drift
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Skill: write_doc
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: create_doc
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: fix_template_drift
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Create Doc Chain — Algorithm
- ## CHAIN
- ## PURPOSE
- ## DETECTION ALGORITHM
- # 1. Find all code modules
- # Returns: ["auth", "utils", "api", ...]
- # 2. Find all doc chains
- # Returns: {"auth": ["OBJECTIVES", "PATTERNS", ...], ...}
- # 3. Expected chain
- # UNDOCUMENTED
- # Check completeness
- # INCOMPLETE_CHAIN
- ## TASK CREATION ALGORITHM
- # 1. Get task template
- # 2. Determine nature based on severity
- # 3. Create task_run node
- # Create Documentation: {problem['target']}
- # 4. Create links
- ## EXECUTION ALGORITHM
- # 1. Load skill
- # 2. Start procedure
- # 3. Execute steps
- # Each step = one doc file
- # Agent fills template
- # Write doc
- # Mark step complete
- # 4. End procedure
- ## VALIDATION ALGORITHM
- # 1. All files present?
- # 2. No placeholders?
- # 3. Structure matches template?
- # 4. Result
- ## DECISION TREE

**Sections:**
- # Create Doc Chain — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Missing Doc Detection
- ## B2: Incomplete Chain Detection
- ## B3: Task Creation
- ## B4: Agent Pickup
- ## B5: Doc Creation
- ## B6: Validation
- ## B7: Resolution Confirmation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Create Doc Chain — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Sections:**
- # Create Doc Chain — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/create-doc-chain/runtime/checks.py
- # TASK_create_doc.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # SKILL_write_doc.md
- ## Gates
- ## Process
- # PROCEDURE_create_doc.yaml
- ## INTEGRATION POINTS

**Sections:**
- # Create Doc Chain — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Create Doc Chain — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Create Doc Chain — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Create Doc Chain — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Create Doc Chain — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/derive-tasks/HEALTH.md`

**Definitions:**
- `class VisionObjective`
- `class ObjectiveCoverage`
- `def find_vision_docs()`
- `def parse_objectives_from_markdown()`
- `def get_all_objectives()`
- `def get_objective_state_file()`
- `def get_tasks_for_objective()`
- `def get_last_task_activity()`
- `def analyze_coverage()`
- `def orphan_objectives()`
- `def low_coverage()`
- `def stale_objectives()`
- `def vision_sync()`

**Sections:**
- # Skill: Decompose Objective
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process

**Sections:**
- # Task: assess_objective
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Validation
- ## Process

**Sections:**
- # Task: derive_tasks
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Validation
- ## Process

**Sections:**
- # Derive Tasks — Algorithm
- ## CHAIN
- ## CORE ALGORITHMS
- # Find vision docs
- # Strategy 1: Ranked objectives sections
- # Look for "## O1:", "### O2:", etc.
- # Strategy 2: Bullet points under "Objectives" header
- # Look for "## Objectives" followed by bullets
- # Find linked tasks
- # Weight completed fully, in_progress half
- # Check last activity
- # Analyze current state
- # Identify what's missing
- # Ensure actionable scope
- ## DATA STRUCTURES

**Sections:**
- # Derive Tasks — Behaviors
- ## CHAIN
- ## OBSERVABLE BEHAVIORS
- ## INTERACTION PATTERNS

**Sections:**
- # Derive Tasks — Health
- ## CHAIN
- ## IMPLEMENTS
- ## HEALTH INDICATORS
- ## INDICATOR: orphan_objectives
- ## INDICATOR: low_coverage
- ## INDICATOR: stale_objectives
- ## INDICATOR: vision_sync
- # Auto-resync

**Sections:**
- # Derive Tasks — Implementation
- ## CHAIN
- ## FILE STRUCTURE
- ## RUNTIME COMPONENTS
- ## INTEGRATION POINTS
- ## CLI COMMANDS
- # Scan vision docs and show objectives
- # Show coverage for all objectives
- # Show gaps (orphan/low/stale)
- # Derive tasks for specific objective
- # Mark objective achieved
- ## MCP TOOLS

**Sections:**
- # Derive Tasks — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Derive Tasks — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Derive Tasks — Sync
- ## CHAIN
- ## CURRENT STATE
- ## MATURITY
- ## DEPENDENCIES
- ## HANDOFFS

**Sections:**
- # Derive Tasks — Validation
- ## CHAIN
- ## INVARIANTS
- ## ACCEPTANCE CRITERIA

**Sections:**
- # Derive Tasks — Vocabulary
- ## CHAIN
- ## TERMS
- ## PROBLEMS
- ## STATES

**Definitions:**
- `def scan_for_gaps()`
- `def strip_for_comparison()`
- `def compute_ngram_similarity()`
- `def ngrams()`
- `def detect_duplicates()`
- `def detect_large_docs()`
- `def gap_detection()`
- `def duplication_detection()`
- `def size_detection()`

**Sections:**
- # Skill: fill_gaps
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Escalation Triggers
- ## Executes
- ## Used By

**Sections:**
- # Task: dedupe_content
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: fill_gap
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: split_large_doc
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Fill Gaps — Algorithm
- ## CHAIN
- ## PURPOSE
- ## GAP DETECTION ALGORITHM
- ## DUPLICATION DETECTION ALGORITHM
- # 1. Load all doc contents
- # Strip headers and CHAIN sections for comparison
- # 2. Compare all pairs
- # Remove CHAIN code blocks
- # Remove status blocks
- # Remove markdown headers (keep content)
- ## SIZE DETECTION ALGORITHM
- ## GAP FILLING ALGORITHM
- # 1. Read surrounding context
- # 2. Research content to fill gap
- # 3. Generate content
- # 4. Replace gap marker with content
- # 5. Write updated doc
- # 6. Update SYNC
- ## DEDUPLICATION ALGORITHM
- # 1. Determine canonical source
- # 2. Identify overlapping sections
- # 3. For each overlap:
- # Replace duplicate with reference
- # 4. Write updated secondary
- # 5. Update SYNC
- # Similar size: prefer docs/ location
- # Default to first (arbitrary but consistent)
- ## DOC SPLITTING ALGORITHM
- # Parse SYNC sections
- # Keep: STATUS, CHAIN, CURRENT STATE, RECENT (last 30 days)
- # Archive: older entries
- # Write archive file
- # Write trimmed SYNC
- # Identify split points (## headers with substantial content)
- # Group into chunks under 200 lines
- # Create new files
- # Keep first chunk in original file
- # Create new file for additional chunks
- # Add cross-references
- ## DECISION TREE

**Sections:**
- # Fill Gaps — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Gap Detection
- ## B2: Duplication Detection
- ## B3: Size Detection
- ## B4: Task Creation
- ## B5: Gap Filling
- ## B6: Content Deduplication
- ## B7: Doc Splitting
- ## B8: Validation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Fill Gaps — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## CHECKER INDEX
- ## HOW TO RUN
- # Run all health checks for this capability
- # Run a specific checker
- ## KNOWN GAPS

**Sections:**
- # Fill Gaps — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/fill-gaps/runtime/checks.py
- # TASK_fill_gap.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # TASK_dedupe_content.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # TASK_split_large_doc.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # SKILL_fill_gaps.md
- ## Gates
- ## Process
- # PROCEDURE_fill_gaps.yaml
- ## INTEGRATION POINTS

**Sections:**
- # Fill Gaps — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Fill Gaps — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Fill Gaps — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Fill Gaps — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Fill Gaps — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/fix-membrane/HEALTH.md`

**Definitions:**
- `class Signal`
- `def healthy()`
- `def degraded()`
- `def critical()`
- `def check()`
- `def decorator()`
- `def procedures_exist()`
- `def yaml_valid()`
- `def steps_valid()`
- `def fields_complete()`

**Sections:**
- # Skill: fix_procedure
- ## Purpose
- ## Gates
- ## Process
- ## Error Patterns
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: add_missing_fields
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Field Defaults
- ## Steps
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: create_procedures
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Steps
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: fix_step_structure
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Common Fixes
- ## Steps
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: fix_yaml_syntax
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Common Fixes
- ## Steps
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Fix Membrane — Algorithm
- ## CHAIN
- ## PURPOSE
- ## DETECTION ALGORITHM
- # 1. Check procedures directory exists
- # 2. Find all YAML files
- # 3. Check each file
- # Layer 1: Can we parse it?
- # Layer 2: Required fields present?
- # Empty steps is also a problem
- # Layer 3: Steps valid?
- # Required step fields
- # Type checks
- ## REPAIR ALGORITHM
- # Common fixes by error pattern
- # Missing colon after key
- # Find first word, add colon after it
- # Indentation issue
- # Try to fix by aligning with previous line
- # Merge conflict markers
- # Remove conflict markers, keep ours
- # Unknown error - escalate
- # Write fixed content
- # Re-validate
- # Load template for defaults
- # Derive from filename
- # Add empty steps list with placeholder
- # Write back
- # Generate id from action or index
- # Default to noop
- # Wrap in dict if string
- ## CREATION ALGORITHM
- # Source templates
- # Validate all created
- ## DECISION TREE

**Sections:**
- # Fix Membrane — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Missing Procedures Detection
- ## B2: Parse Error Detection
- ## B3: Step Validation
- ## B4: Required Fields Validation
- ## B5: Syntax Fix Execution
- ## B6: Structure Fix Execution
- ## B7: Procedure Creation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Fix Membrane — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Doc refs:**
- `skills/SKILL_fix_procedure.md`
- `tasks/TASK_*.md`

**Sections:**
- # Fix Membrane — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/fix-membrane/runtime/checks.py
- ## INTEGRATION POINTS

**Sections:**
- # Fix Membrane — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Fix Membrane — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Fix Membrane — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Fix Membrane — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Fix Membrane — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/flag-errors/HEALTH.md`

**Definitions:**
- `def normalize_message()`
- `def extract_stack_signature()`
- `def compute_fingerprint()`
- `def parse_error_line()`
- `def get_watched_log_paths()`
- `def get_known_fingerprints()`
- `def save_fingerprint()`
- `def new_errors()`
- `def error_spike()`
- `def watch_coverage()`
- `def stale_errors()`

**Sections:**
- # Skill: Triage Error
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Uses Procedure

**Sections:**
- # Task: configure_watch
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Validation
- ## Instance (task_run)
- ## Steps

**Sections:**
- # Task: investigate_error
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)
- ## Lifecycle

**Sections:**
- # Flag Errors — Algorithm
- ## CHAIN
- ## CORE ALGORITHM
- # Read new content
- # Parse errors
- # Process each error
- # Update position
- # Extract components
- # Normalize message
- # Stack signature (top 3 frames)
- # Combine and hash
- # Check for existing task
- # New error - create task
- # Update existing
- # Check for spike
- # Get recent rate (last hour)
- # Get baseline rate (last 7 days average)
- # Spike if 10x baseline (with minimum threshold)
- # Get last occurrence
- # Check quiet period (24 hours after fix)
- ## DATA STRUCTURES
- # .mind/config/error_watch.yaml

**Sections:**
- # Flag Errors — Behaviors
- ## CHAIN
- ## OBSERVABLE BEHAVIORS
- ## INTERACTION PATTERNS

**Sections:**
- # Flag Errors — Health
- ## CHAIN
- ## IMPLEMENTS
- ## HEALTH INDICATORS
- ## CHECKER INDEX
- ## INDICATOR: new_errors
- ## INDICATOR: error_spike
- ## INDICATOR: watch_coverage
- ## INDICATOR: stale_errors
- ## HOW TO RUN
- # Run all error health checks
- # Run specific checker
- # Force scan all logs now

**Sections:**
- # Flag Errors — Implementation
- ## CHAIN
- ## FILE STRUCTURE
- ## RUNTIME COMPONENTS
- # runtime/checks.py
- # runtime/checks.py
- # runtime/checks.py
- ## CONFIGURATION
- # .mind/config/error_watch.yaml
- ## INTEGRATION POINTS
- # Task creation on NEW_ERROR
- # Error fingerprint tracking
- ## CLI COMMANDS
- # List watched log files
- # Add log file to watch
- # Show recent errors
- # Show error details
- # Mark error resolved
- ## MCP TOOLS

**Sections:**
- # Flag Errors — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Flag Errors — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Flag Errors — Sync
- ## CHAIN
- ## CURRENT STATE
- ## MATURITY
- ## OPEN QUESTIONS
- ## DEPENDENCIES
- ## RECENT CHANGES
- ## HANDOFFS

**Sections:**
- # Flag Errors — Validation
- ## CHAIN
- ## INVARIANTS
- ## ACCEPTANCE CRITERIA

**Sections:**
- # Flag Errors — Vocabulary
- ## CHAIN
- ## TERMS
- ## PROBLEMS
- ## STATES

**Definitions:**
- `def is_stub_body()`
- `def extract_functions_from_ast()`
- `def get_docs_marker()`
- `def get_last_updated()`
- `def get_git_mtime()`
- `def stub_detection()`
- `def incomplete_detection()`
- `def undoc_impl_detection()`
- `def stale_impl_detection()`

**Sections:**
- # Skill: implement
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: complete_impl
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: document_impl
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: implement_stub
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: update_impl_docs
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Implement Code — Algorithm
- ## CHAIN
- ## PURPOSE
- ## STUB DETECTION ALGORITHM
- # Check if body matches stub patterns
- # Normalize body (remove docstrings, comments)
- # Empty body after stripping
- # Check against stub patterns
- ## TODO DETECTION ALGORITHM
- # Extract marker context
- ## UNDOC IMPL DETECTION ALGORITHM
- # Find all IMPLEMENTATION files
- # Check for ALGORITHM.md
- # Check if ALGORITHM is a stub
- ## STALE IMPL DETECTION ALGORITHM
- # Get all code files with DOCS: markers
- # Compare modification times
- ## TASK CREATION ALGORITHM
- # Map problem types to tasks
- # Map severity to nature
- # {TASK_MAP[problem['type']]}: {problem.get('file', problem.get('module'))}
- ## EXECUTION ALGORITHM
- # 1. Read ALGORITHM.md for spec
- # 2. Find function spec in ALGORITHM
- # No spec — escalate or use docstring
- # 3. Implement
- # 4. Write and test
- # Retry or escalate
- # 1. Read TODO context
- # 2. Understand what's missing
- # 3. Implement
- # 4. Replace TODO section with implementation
- # 5. Remove TODO marker
- # 6. Test
- # 1. Read implementation code
- # 2. Analyze code for algorithms
- # 3. Load template
- # 4. Create ALGORITHM.md
- # 5. Write
- # 1. Get code diff
- # 2. Analyze what changed
- # 3. Read current docs
- # 4. Update docs
- # 5. Write
- # 6. Update LAST_UPDATED
- ## DECISION TREE

**Sections:**
- # Implement Code — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Stub Detection
- ## B2: TODO Detection
- ## B3: Missing Algorithm Detection
- ## B4: Stale Doc Detection
- ## B5: Task Creation
- ## B6: Agent Pickup
- ## B7: Stub Implementation
- ## B8: Incomplete Completion
- ## B9: Algorithm Documentation
- ## B10: Doc Sync
- ## B11: Validation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Implement Code — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Sections:**
- # Implement Code — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/implement-code/runtime/checks.py
- # ... detection logic ...
- # ... detection logic ...
- # ... detection logic ...
- # ... detection logic ...
- # SKILL_implement.md
- ## Gates
- ## Process
- # PROCEDURE_implement.yaml
- ## INTEGRATION POINTS

**Sections:**
- # Implement Code — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Implement Code — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Implement Code — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Implement Code — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Implement Code — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/improve-quality/IMPLEMENTATION.md`

**Docs:** `capabilities/improve-quality/HEALTH.md`

**Definitions:**
- `def count_effective_lines()`
- `def scan_for_secrets()`
- `def scan_for_magic_values()`
- `def scan_for_long_prompts()`
- `def scan_for_complex_sql()`
- `def check_naming_convention()`
- `def monolith_detection()`
- `def secret_detection()`
- `def magic_value_detection()`
- `def prompt_length_detection()`
- `def sql_complexity_detection()`
- `def naming_convention_detection()`

**Sections:**
- # Skill: refactor
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By
- ## Anti-Patterns

**Sections:**
- # Task: compress_prompt
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Process
- ## Compression Strategies
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: extract_constants
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Process
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: extract_secrets
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Process
- ## Validation
- ## Security Checklist
- ## Instance (task_run)

**Code refs:**
- `camelCase.ts`
- `snake_case.py`

**Sections:**
- # Task: fix_naming
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Process
- ## Convention Rules
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: refactor_sql
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Process
- ## Refactoring Strategies
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: split_monolith
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Process
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Improve Quality — Algorithm
- ## CHAIN
- ## PURPOSE
- ## DETECTION ALGORITHMS
- # Count non-blank, non-comment lines
- # Patterns to flag
- # Exceptions
- # Secret patterns
- # Skip if in example/test
- # Find prompt variables
- # Find SQL strings
- # Check length
- # Count JOINs
- # Count subquery depth
- # Check filename
- # Check internal names (requires parsing)
- # Class names
- ## TASK CREATION ALGORITHM
- # Task mapping
- # Nature mapping
- # Quality Fix: {problem['type']}
- ## RESOLUTION ALGORITHMS
- # Validate
- # Validate
- ## DECISION TREE

**Sections:**
- # Improve Quality — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Monolith Detection
- ## B2: Magic Value Detection
- ## B3: Secret Detection
- ## B4: Prompt Length Detection
- ## B5: SQL Complexity Detection
- ## B6: Naming Violation Detection
- ## B7: Task Creation
- ## B8: Script Execution (Mechanical Fixes)
- ## B9: Agent Execution (Judgment Required)
- ## B10: Resolution Confirmation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Improve Quality — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## CHECKER INDEX
- ## KNOWN GAPS

**Sections:**
- # Improve Quality — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/improve-quality/runtime/checks.py
- # tasks/TASK_split_monolith.md
- # skills/SKILL_refactor.md
- # procedures/PROCEDURE_refactor.yaml
- ## INTEGRATION POINTS
- ## SCRIPTS
- # scripts/extract_constants.py
- # Read file
- # Create constants block
- # Replace occurrences
- # Write file
- # scripts/extract_secrets.py
- # Read file
- # Replace secret with os.environ.get()
- # Add to .env.example
- # Write file
- # scripts/rename_to_convention.py
- # Determine correct name
- # Rename file
- # Update all imports
- ## CONFIGURATION
- # .mind/config.yaml
- # .mind/config.yaml

**Sections:**
- # Improve Quality — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Improve Quality — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Improve Quality — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Improve Quality — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Improve Quality — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Definitions:**
- `def log_error_detection()`
- `def hook_documentation()`
- `def _infer_trigger_type()`

**Sections:**
- # Skill: investigate
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: document_hook
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: investigate_error
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Investigate Runtime — Algorithm
- ## CHAIN
- ## PURPOSE
- ## LOG ERROR DETECTION ALGORITHM
- # 1. Define error patterns
- # 2. Scan log files
- # 3. Deduplicate by message signature
- ## HOOK DETECTION ALGORITHM
- # 1. Define hook locations
- # 2. Find all hook files
- # 3. Check for documentation
- # Check BEHAVIORS docs
- ## TASK CREATION ALGORITHM
- # 1. Get appropriate template
- # 2. Determine nature based on severity
- # 3. Create task_run node
- # {problem['type']}: Investigation Required
- # 4. Create links
- ## INVESTIGATION ALGORITHM
- # 1. Load skill
- # 2. Start procedure
- # 3. Execute investigation steps
- # Step 1: Gather context
- # Step 2: Form hypothesis
- # Step 3: Verify hypothesis
- # No hypothesis confirmed — escalate
- # 4. Record output
- ## HOOK DOCUMENTATION ALGORITHM
- # 1. Read hook code
- # 2. Analyze hook
- # 3. Create BEHAVIORS documentation
- ## Hook: {task_run.hook_name}
- # 4. Add to appropriate BEHAVIORS.md
- # 5. Mark complete
- ## DECISION TREE

**Sections:**
- # Investigate Runtime — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Log Error Detection
- ## B2: Hook Discovery
- ## B3: Task Creation (Error)
- ## B4: Task Creation (Hook)
- ## B5: Agent Investigation
- ## B6: Investigation Execution
- ## B7: Hook Documentation
- ## B8: Resolution Confirmation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Investigate Runtime — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Sections:**
- # Investigate Runtime — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/investigate-runtime/runtime/checks.py
- # TASK_investigate_error.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # TASK_document_hook.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # SKILL_investigate.md
- ## Gates
- ## Process
- # PROCEDURE_investigate.yaml
- ## INTEGRATION POINTS

**Sections:**
- # Investigate Runtime — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Investigate Runtime — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Investigate Runtime — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Investigate Runtime — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Investigate Runtime — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Definitions:**
- `def impl_link_validity()`
- `def orphan_doc_detection()`

**Sections:**
- # Skill: fix_links
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: fix_impl_link
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Resolution Strategies
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: fix_orphan_docs
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Resolution Strategies
- ## Validation
- ## Instance (task_run)

**Code refs:**
- `path/to/file.py`

**Sections:**
- # Maintain Links — Algorithm
- ## CHAIN
- ## PURPOSE
- ## IMPL LINK VALIDATION ALGORITHM
- # 1. Parse document for IMPL: markers
- # Returns: ["src/auth/login.py", "lib/utils.ts", ...]
- # 2. Resolve path relative to project root
- # 3. Check if target exists
- ## ORPHAN DETECTION ALGORITHM
- # 1. Get all doc files
- # 2. Get all code files with DOCS: markers
- # 3. Check if doc has valid IMPL: links
- # 4. Check if any code references this doc
- # 5. If neither, it's orphan
- ## AUTO-RESOLUTION ALGORITHM
- # 1. Extract filename from broken path
- # 2. Search for file with same name
- # 3a. Single match - high confidence
- # 3b. Multiple matches - need disambiguation
- # Try to find best match by directory similarity
- # 4. No match or low confidence - escalate
- # Score based on matching path components
- ## TASK CREATION ALGORITHM
- # 1. Get task template
- # 2. Create task_run node
- # Fix Link: {problem['doc']}
- # 3. Create links
- ## DECISION TREE

**Sections:**
- # Maintain Links — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Broken IMPL Link Detection
- ## B2: Orphan Doc Detection
- ## B3: Automatic Path Resolution
- ## B4: Task Creation
- ## B5: Agent Pickup
- ## B6: Link Repair (BROKEN_IMPL_LINK)
- ## B7: Orphan Resolution (ORPHAN_DOCS)
- ## B8: Validation
- ## BEHAVIOR SUMMARY

**Sections:**
- # Maintain Links — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## CHECKERS
- ## HOW TO RUN
- # Run all health checks for this capability
- # Run a specific checker
- ## KNOWN GAPS

**Sections:**
- # Maintain Links — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/maintain-links/runtime/checks.py
- # Parse doc, check each IMPL: path exists
- # Check each doc has valid IMPL or DOCS ref
- # TASK_fix_impl_link.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # TASK_fix_orphan_docs.md
- ## Inputs
- ## Outputs
- ## Uses
- ## Executes
- # SKILL_fix_links.md
- ## Gates
- ## Process
- # PROCEDURE_fix_links.yaml
- ## INTEGRATION POINTS

**Sections:**
- # Maintain Links — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Maintain Links — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Maintain Links — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Maintain Links — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Code refs:**
- `lib/utils.ts`
- `path/to/file.py`
- `src/auth/login.py`
- `src/old_module.py`

**Sections:**
- # Maintain Links — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `docs/capabilities/monitor-agents/ALGORITHM.md`

**Definitions:**
- `def agent_health()`
- `def task_health()`

**Sections:**
- # Task: cleanup_dead_agent
- ## Purpose
- ## Trigger
- ## Steps
- ## Context Required
- ## Invariants After

**Sections:**
- # Task: investigate_health_failure
- ## Purpose
- ## Trigger
- ## Context Provided
- ## Agent Instructions
- ## Investigation Steps
- ## Common Issues
- ## Do NOT
- ## Success Criteria
- ## Escalation

**Sections:**
- # Task: log_stuck_agent
- ## Purpose
- ## Trigger
- ## Steps
- ## Context Required
- ## Notes

**Sections:**
- # Task: release_orphan_task
- ## Purpose
- ## Trigger
- ## Steps
- ## Context Required
- ## Invariants After

**Sections:**
- # Task: unstick_task
- ## Purpose
- ## Trigger
- ## Steps
- ## Context Required
- ## Behavior

**Sections:**
- # Algorithm: monitor-agents
- ## Main Loop
- # Runs every 60 seconds via cron trigger
- # 1. Check all running agents
- # 2. Check all claimed/running tasks
- ## Agent Health Check
- # Warning only
- # Dead - cleanup required
- # 1. Mark actor dead
- # 2. Find and release claimed tasks
- # 3. Remove WORKS_ON links
- ## Task Health Check
- # Check for orphan first
- # Check for stuck
- # Release after 2h
- ## Health Check Error Handling
- # In MCP server, not in check.py
- # Create problem for investigation
- ## Timing

**Sections:**
- # Behaviors: monitor-agents
- ## Observable Behaviors
- ## State Transitions

**Sections:**
- # Health: monitor-agents
- ## Health Checks
- ## Signals
- ## Self-Monitoring
- # Check that cron is registered and running

**Code refs:**
- `runtime/checks.py`

**Sections:**
- # Implementation: monitor-agents
- ## File Structure
- ## Runtime Checks
- ## Graph Queries
- ## Dependencies
- ## Configuration
- # Thresholds (could be configurable)

**Sections:**
- # Objectives: monitor-agents
- ## Purpose
- ## Goals (Ranked)
- ## Non-Goals
- ## Success Metrics

**Sections:**
- # Patterns: monitor-agents
- ## Design Philosophy
- ## Core Pattern: Heartbeat Monitoring
- ## Core Pattern: Task Lifecycle
- ## Executor Types
- ## Scope

**Sections:**
- # SYNC: monitor-agents
- ## Current State
- ## Recent Changes
- ## Open Questions
- ## Next Steps

**Sections:**
- # Validation: monitor-agents
- ## Invariants
- ## Constraints
- ## Test Cases

**Sections:**
- # Vocabulary: monitor-agents
- ## Problems
- ## Problem Details
- ## Terms
- ## Thresholds

**Sections:**
- # Skill: solve_markers
- ## Purpose
- ## Gates
- ## Process
- ## Tips
- ## Executes
- ## Used By

**Sections:**
- # Task: answer_question
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Process
- ## Instance (task_run)

**Sections:**
- # Task: evaluate_proposition
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Process
- ## Instance (task_run)

**Sections:**
- # Task: fix_legacy_marker
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Process
- ## Instance (task_run)

**Sections:**
- # Task: resolve_escalation
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Process
- ## Instance (task_run)

**Sections:**
- # Solve Markers — Algorithm
- ## CHAIN
- ## PURPOSE
- ## DETECTION ALGORITHM
- # 1. Scan for @mind:escalation
- # 2. Scan for @mind:proposition
- # 3. Scan for legacy markers
- # 4. Scan for unresolved questions
- ## CLASSIFICATION ALGORITHM
- ## TASK CREATION ALGORITHM
- # Create task_run node
- # Resolve {marker['type']}: {marker['file']}:{marker['line']}
- ## Required Action
- # Create links
- ## RESOLUTION ALGORITHMS
- # 1. Read context
- # 2. Analyze options
- # 3. If agent can decide
- # Escalate to human
- # 4. Document decision
- # 5. Remove marker
- # 1. Read context
- # 2. Evaluate
- # 3. Disposition
- # Create implementation task
- # 4. Document
- # 5. Remove marker
- # 1. Read context
- # 2. Analyze
- # 3. Action
- # Delete obsolete marker
- # Fix it now
- # Convert to tracked task
- # Replace with task reference
- # 1. Read context
- # 2. Research
- # 3. Document answer
- # Add answer as comment or doc update
- # Need human input
- ## DECISION TREE

**Sections:**
- # Solve Markers — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Escalation Detection
- ## B2: Proposition Detection
- ## B3: Legacy Marker Detection
- ## B4: Question Detection
- ## B5: Task Creation
- ## B6: Agent Pickup
- ## B7: Resolution Execution
- ## B8: Marker Removal
- ## B9: Verification
- ## BEHAVIOR SUMMARY

**Sections:**
- # Solve Markers — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## SUMMARY
- ## KNOWN GAPS

**Doc refs:**
- `skills/SKILL_solve_markers.md`

**Sections:**
- # Solve Markers — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/solve-markers/runtime/checks.py
- ## INTEGRATION POINTS

**Sections:**
- # Solve Markers — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Solve Markers — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Solve Markers — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Solve Markers — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Solve Markers — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/steer-project/HEALTH.md`

**Definitions:**
- `class EscalationMarker`
- `class SteeringSession`
- `def find_sync_files()`
- `def get_file_age_days()`
- `def find_escalation_markers()`
- `def get_last_steering_session()`
- `def get_recent_commits()`
- `def get_active_tasks()`
- `def steering_due()`
- `def stale_sync()`
- `def unprocessed_escalations()`
- `def project_momentum()`

**Sections:**
- # Skill: Strategic Assessment
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process

**Sections:**
- # Task: process_escalation
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Validation
- ## Process

**Sections:**
- # Task: steering_session
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Validation
- ## Process

**Sections:**
- # Task: update_sync
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Validation
- ## Process

**Sections:**
- # Steer Project — Algorithm
- ## CHAIN
- ## CORE ALGORITHMS
- # Phase 1: Gather State
- # Phase 2: Assess
- # Phase 3: Act
- # Phase 4: Report
- # Pattern: Multiple tasks blocked on same thing
- # Create task to update stale SYNC file
- ## DATA STRUCTURES

**Sections:**
- # Steer Project — Behaviors
- ## CHAIN
- ## OBSERVABLE BEHAVIORS
- ## INTERACTION PATTERNS

**Sections:**
- # Steer Project — Health
- ## CHAIN
- ## IMPLEMENTS
- ## HEALTH INDICATORS
- ## INDICATOR: steering_due
- ## INDICATOR: stale_sync
- ## INDICATOR: unprocessed_escalations
- ## INDICATOR: project_momentum

**Sections:**
- # Steer Project — Implementation
- ## CHAIN
- ## FILE STRUCTURE
- ## RUNTIME COMPONENTS
- ## INTEGRATION POINTS
- ## CLI COMMANDS
- # Run steering session manually
- # Show project health
- # Show pending escalations
- # Show stale SYNC files
- # Process specific escalation
- ## MCP TOOLS

**Sections:**
- # Steer Project — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Steer Project — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Steer Project — Sync
- ## CHAIN
- ## CURRENT STATE
- ## MATURITY
- ## DEPENDENCIES
- ## HANDOFFS

**Sections:**
- # Steer Project — Validation
- ## CHAIN
- ## INVARIANTS
- ## ACCEPTANCE CRITERIA

**Sections:**
- # Steer Project — Vocabulary
- ## CHAIN
- ## TERMS
- ## PROBLEMS
- ## STATES

**Docs:** `capabilities/sync-state/HEALTH.md`

**Definitions:**
- `class Signal`
- `def healthy()`
- `def degraded()`
- `def critical()`
- `def check()`
- `def decorator()`
- `class triggers`
- `class cron`
- `def daily()`
- `class command`
- `def on()`
- `class file`
- `def on_change()`
- `def sync_freshness()`
- `def yaml_drift()`
- `def ingestion_coverage()`
- `def blocked_modules()`

**Sections:**
- # Skill: update_sync
- ## Purpose
- ## Context
- ## Gates
- ## Process
- ## Tips
- ## Quality Checklist
- ## Executes
- ## Used By
- ## Common Mistakes

**Sections:**
- # Task: ingest_docs
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: regenerate_yaml
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Task: unblock_module
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)
- ## Escalation Criteria

**Sections:**
- # Task: update_sync
- ## Purpose
- ## Resolves
- ## Inputs
- ## Outputs
- ## Executor
- ## Uses
- ## Executes
- ## Validation
- ## Instance (task_run)

**Sections:**
- # Sync State — Algorithm
- ## CHAIN
- ## PURPOSE
- ## STALE SYNC DETECTION ALGORITHM
- # Find all SYNC files
- # Extract LAST_UPDATED
- # No date = stale
- ## YAML DRIFT DETECTION ALGORITHM
- # 1. Get modules from YAML
- # 2. Get modules from file system
- # Check if it's a module (has at least SYNC or PATTERNS)
- # 3. Compare
- ## INGESTION GAP DETECTION ALGORITHM
- # 1. Get all doc files from disk
- # Normalize to relative path
- # 2. Query graph for doc nodes
- # 3. Find gaps
- ## BLOCKER DETECTION ALGORITHM
- # Check for BLOCKED status
- # Extract module name from path
- # Try to find blocker description
- # Check how long blocked
- ## SYNC UPDATE ALGORITHM
- # 1. Get module from path
- # 2. Check git log for recent changes
- # 3. Load current SYNC
- # 4. Parse sections
- # 5. Update with new info
- # 6. Write updated SYNC
- ## YAML REGENERATION ALGORITHM
- # 1. Scan for modules
- # Check if valid module
- # 2. Build YAML structure
- # 3. Write
- ## DECISION TREE

**Sections:**
- # Sync State — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Stale SYNC Detection
- ## B2: YAML Drift Detection
- ## B3: Ingestion Gap Detection
- ## B4: Blocker Detection
- ## B5: SYNC Update Execution
- ## B6: YAML Regeneration Execution
- ## B7: Doc Ingestion Execution
- ## B8: Blocker Resolution
- ## BEHAVIOR SUMMARY

**Sections:**
- # Sync State — Health
- ## CHAIN
- ## PURPOSE
- ## FLOWS
- ## INDICATORS
- ## KNOWN GAPS

**Doc refs:**
- `skills/SKILL_update_sync.md`
- `tasks/TASK_*.md`

**Sections:**
- # Sync State — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- # capabilities/sync-state/runtime/checks.py
- # Critical if blocked > 7 days
- ## INTEGRATION POINTS
- ## EXECUTION MODES

**Sections:**
- # Sync State — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Sync State — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DESIGN DECISIONS
- ## SCOPE

**Sections:**
- # Sync State — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Sync State — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## PRIORITY
- ## INVARIANT INDEX
- ## ERROR MESSAGES
- ## TASK COMPLETION CRITERIA

**Sections:**
- # Sync State — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In HEALTH.md

**Docs:** `capabilities/system-health/HEALTH.md`

**Definitions:**
- `def stuck_agent_detection()`
- `def orphan_task_detection()`
- `def health_check_failure()`
- `def agent_queue_health()`

**Sections:**
- # Task: Investigate Stuck Agent
- ## Problem
- ## Resolution
- ## When Agent Needed
- ## Evidence Required

**Sections:**
- # Health: system-health
- ## Health Indicators

**Sections:**
- # Vocabulary: system-health
- ## Problems
- ## Thresholds
- ## Auto-Resolution

**Sections:**
- # Capabilities — Algorithm
- ## CHAIN
- ## PURPOSE
- ## CAPABILITY LIFECYCLE
- ## STEP 1: DETECTION
- ## STEP 2: TASK CREATION
- ## STEP 3: PICKUP
- ## STEP 4: EXECUTION
- ## STEP 5: VALIDATION
- ## STEP 6: RESOLUTION
- ## DECISION TREE: TRIGGER ROUTING

**Sections:**
- # Capabilities — Behaviors
- ## CHAIN
- ## PURPOSE
- ## B1: Capability Discovery
- ## B2: Problem Detection
- ## B3: Task Creation
- ## B4: Task Pickup
- ## B5: Skill Loading
- ## B6: Execution
- ## B7: Validation
- ## B8: Resolution
- ## BEHAVIOR SUMMARY

**Sections:**
- # Capabilities — Health
- ## CHAIN
- ## PURPOSE
- ## DOCKS
- ## INDICATORS
- # Complete Capability Docs
- # Fix Resolution Path
- # Review Orphan Capability
- # Sync Capability Docs
- ## HOW TO RUN
- # Check all capability health
- # Check specific capability
- # Run via MCP

**Sections:**
- # Capabilities — Implementation
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## KEY COMPONENTS
- ## INTEGRATION POINTS
- # HEALTH.md triggers health checks
- # Connects to: .mind/mind/health/
- # tasks/ folder contains task templates
- # on_problem references these templates
- # task_run instances created when problems detected
- # Connects to: .mind/mind/tasks/
- # skills/ folder contains skill definitions
- # Tasks reference skills
- # Agents load skills when claiming tasks
- # Connects to: .mind/skills/
- # procedures/ folder contains procedure definitions
- # Skills reference procedures
- # Procedures guide step-by-step execution
- # Connects to: .mind/procedures/
- ## CLI COMMANDS
- # List capabilities
- # Validate a capability
- # Run capability health check
- # Create new capability from template
- ## MCP TOOLS
- # Query capabilities
- # Get capability details
- # Trigger capability check

**Sections:**
- # Capabilities — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## SUCCESS SIGNALS

**Sections:**
- # Capabilities — Patterns
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## ORGAN METAPHORS
- ## PRINCIPLES
- ## ARCHITECTURE
- ## SCOPE

**Sections:**
- # Capabilities — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Capabilities — Validation
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## VALIDATION CHECKS
- ## ERROR MESSAGES

**Sections:**
- # Capabilities — Vocabulary
- ## CHAIN
- ## PURPOSE
- ## TERMS
- ## PROBLEMS
- ## USAGE
- # In a capability's HEALTH.md

**Sections:**
- # Capability Runtime — Algorithm
- ## CHAIN
- ## A1: Capability Discovery
- ## A2: Load Checks from Capability
- # Dynamic import
- # Collect @check decorated functions
- ## A3: Check Registration
- ## A4: Trigger Dispatch
- # Build context
- # ... read-only accessors
- # Call check with timeout
- ## A5: Task Creation from Signal
- # Create task_run node
- # Link to task template
- # Link to problem
- ## A6: MCP Startup Integration
- # Phase 1: Discovery
- # Phase 2: Registration
- # Phase 3: Run init triggers
- # Phase 4: Setup file watcher
- # Phase 5: Setup cron
- ## DATA STRUCTURES
- # Convenience accessors
- # Read-only methods
- ## SEQUENCE: Full Trigger Flow
- ## DECORATOR IMPLEMENTATION
- # mind/capability/decorators.py
- # Register in module's __checks__ list

**Code refs:**
- `__init__.py`

**Sections:**
- # Capability Runtime — Behaviors
- ## CHAIN
- ## B1: Capability Discovery
- ## B2: Handler Registration
- ## B3: Trigger Dispatch
- ## B4: Task Creation
- ## B5: Health Check Integration
- ## B6: Graceful Degradation
- ## BEHAVIOR MATRIX
- ## ERROR BEHAVIORS

**Sections:**
- # Capability Runtime — Health
- ## CHAIN
- ## HEALTH SIGNALS
- ## HEALTH MATRIX
- ## MONITORING IMPLEMENTATION
- # H1: Load success
- # H2: Handlers registered
- # H3: Latency
- # H4: Error rate
- ## DASHBOARD OUTPUT

**Code refs:**
- `mcp/health.py`
- `mcp/server.py`
- `runtime/capability/base.py`
- `runtime/capability/dispatch.py`
- `runtime/capability/loader.py`
- `runtime/capability/registry.py`

**Sections:**
- # Capability Runtime — Implementation
- ## CHAIN
- ## CODE LOCATIONS
- ## KEY CLASSES
- # Injected by MCP
- # Find CHECKS list or scan for decorated functions
- ## DATA FLOW
- ## CONFIGURATION
- ## DEPENDENCIES
- ## IMPLEMENTATION STATUS
- ## FILE STRUCTURE (Full)

**Code refs:**
- `mcp/server.py`
- `runtime/ingest/docs.py`

**Sections:**
- # Capability Runtime — Objectives
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## TRADEOFFS
- ## DEPENDENCIES

**Sections:**
- # Capability Runtime — Patterns
- ## CHAIN
- ## CORE PATTERN: Self-Contained Capabilities
- ## PATTERN: Decorator-Based Health Checks
- # capabilities/create-doc-chain/runtime/checks.py
- ## PATTERN: Trigger Types
- ## PATTERN: Signal Return Values
- # Simple returns
- # With context data (for task creation)
- ## PATTERN: Check Context
- ## PATTERN: Task Creation Flow
- ## PATTERN: Capability Isolation
- # MCP loader (runtime/capability/loader.py)
- # Continue loading other capabilities
- ## PATTERN: Context Propagation
- # Trigger info
- # Payload (varies by trigger type)
- # Read-only accessors (see Check Context section)
- ## ANTI-PATTERNS
- ## DESIGN RATIONALE

**Code refs:**
- `base.py`
- `dispatch.py`
- `loader.py`
- `mcp/server.py`
- `registry.py`
- `runtime/capability/base.py`
- `runtime/capability/dispatch.py`
- `runtime/capability/loader.py`
- `runtime/capability/registry.py`

**Sections:**
- # Capability Runtime — Sync
- ## CHAIN
- ## CURRENT STATE
- ## WHAT'S DESIGNED
- ## IMPLEMENTATION PLAN
- ## OPEN QUESTIONS
- ## DEPENDENCIES
- ## HANDOFF: FOR IMPLEMENTER
- # __init__.py
- ## RELATED DOCS

**Sections:**
- # Capability Runtime — Validation
- ## CHAIN
- ## INVARIANTS
- # Load each capability independently
- # Verify other capabilities still work
- # Check for imports from sibling capabilities
- ## VALIDATION MATRIX
- ## TEST SCENARIOS

**Doc refs:**
- `docs/ux/PATTERNS_UX_Principles.md`
- `docs/vision/VOCABULARY_Platform_Terms.md`

**Sections:**
- # Concept: AI-Human Partnership
- ## The Core Insight
- ## Partnership Modes
- ## Trust Model
- ## UX for Partnership
- ## Escalations
- ## Implementation Notes
- ## Related

**Sections:**
- # edge_kit — Algorithm: Rendering, Pulses, Directional Shine, and Label Rules
- ## CHAIN
- ## OVERVIEW
- ## DATA STRUCTURES
- ## ALGORITHM: `style_for_edge(edge)`
- ## ALGORITHM: `compute_label_style(edge)`
- ## ALGORITHM: `compute_pulse_duration_ms(edge, declared_duration_ms, speed)`
- ## ALGORITHM: `compute_pulse_path_clamped_to_node_bounds(edge, geometry)`
- ## ALGORITHM: directional shine animation
- ## ALGORITHM: energy magnitude mapping → pulse visuals
- ## COMPLEXITY
- ## MARKERS

**Sections:**
- # edge_kit — Behaviors: Readable, Directional, Truthful Link Effects
- ## CHAIN
- ## OBJECTIVES SERVED
- ## BEHAVIORS
- ## ANTI-BEHAVIORS
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## MARKERS

**Sections:**
- # edge_kit — Health: Link Visibility and Semantic Styling Verification
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## HOW TO RUN
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `connectome_edge_directional_shine_animation_helpers.ts`
- `connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `connectome_node_boundary_intersection_geometry_helpers.ts`
- `semantic_edge_components_with_directional_shine_and_pulses.tsx`

**Doc refs:**
- `docs/connectome/edge_kit/HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md`
- `docs/connectome/event_model/ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md`
- `event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md`

**Sections:**
- # edge_kit — Implementation: Component Map and Render Tokens
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## SCHEMA
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## BIDIRECTIONAL LINKS
- ## RENDER TOKENS (V1)
- ## ENTRY POINTS
- ## CONFIGURATION
- ## MARKERS

**Sections:**
- # OBJECTIVES — Edge Kit
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # edge_kit — Patterns: Color-Coded, Trigger-Typed, Directional Edge Styling
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## DATA
- ## INSPIRATIONS
- ## PRINCIPLES
- ## EDGE TYPES (V1)
- ## DEPENDENCIES
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`

**Doc refs:**
- `docs/connectome/edge_kit/BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md`
- `docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md`
- `docs/connectome/edge_kit/PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md`
- `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
- `docs/connectome/edge_kit/VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # edge_kit — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## TODO
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## CONSCIOUSNESS TRACE
- ## POINTERS

**Sections:**
- # edge_kit — Validation: Invariants for Color, Dash, Direction, and Pulse Truth
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## PROPERTIES
- ## INVARIANTS
- ## SYNC STATUS
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## MARKERS

**Sections:**
- # event_model — Algorithm: Normalizing Inputs into FlowEvents
- ## CHAIN
- ## OVERVIEW
- ## DATA STRUCTURES
- ## ALGORITHM: `normalize_flow_event(raw_input)`
- ## KEY DECISIONS
- ## DATA FLOW
- ## COMPLEXITY
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## MARKERS

**Sections:**
- # event_model — Behaviors: Observable Effects of the FlowEvent Contract
- ## CHAIN
- ## BEHAVIORS
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## ANTI-BEHAVIORS
- ## MARKERS

**Sections:**
- # event_model — Health: Verification Mechanics and Coverage
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: event_schema_conformance
- ## HOW TO RUN
- # Run all health checks for this module
- # Run a specific checker
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`
- `flow_event_schema_and_normalization_contract.ts`

**Sections:**
- # event_model — Implementation: Code Architecture and Structure
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## SCHEMA
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Event Model
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # event_model — Patterns: Contract-First Event Stream for Stepper + Realtime
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app/connectome/lib/flow_event_duration_bucket_color_classifier.ts`
- `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`
- `app/connectome/lib/flow_event_trigger_and_calltype_inference_rules.ts`

**Sections:**
- # event_model — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## KNOWN ISSUES
- ## TODO

**Sections:**
- # event_model — Validation: Invariants for FlowEvent Correctness
- ## CHAIN
- ## INVARIANTS
- ## PROPERTIES
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- # Run health checks (module scoped)
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Connectome Feature Shell
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)
- ## MARKERS

**Sections:**
- # flow_canvas — Algorithm: Zones, Layout, and Label Decluttering
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## ALGORITHM: `render_flow_canvas_frame(store_state, camera, interaction_queue)`
- ## DATA STRUCTURES
- ## ALGORITHM: `compute_zone_layout(viewport)`
- ## ALGORITHM: `place_nodes_with_force_layout(nodes, edges, zones)`
- ## ALGORITHM: `route_edges_and_place_labels(edges, node_layouts)`
- ## ALGORITHM: `apply_camera_transform(camera, world_coords)`
- ## KEY DECISIONS
- ## DATA FLOW
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## COMPLEXITY
- ## MARKERS

**Sections:**
- # flow_canvas — Behaviors: Readability, Stability, and Navigation Effects
- ## CHAIN
- ## OBJECTIVES SERVED
- ## INPUTS / OUTPUTS
- ## BEHAVIORS
- ## EDGE CASES
- ## ANTI-BEHAVIORS
- ## MARKERS
- ## OBSERVATIONS

**Sections:**
- # flow_canvas — Health: Render Stability and Performance Budget Checks
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## CHECKER INDEX
- ## INDICATOR: canvas_edge_disappearance_detector
- ## INDICATOR: canvas_layout_determinism_integrity
- ## INDICATOR: canvas_edge_attachment_and_visibility_integrity
- ## HOW TO RUN
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`
- `app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.ts`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `app/connectome/components/telemetry_camera_controls.ts`
- `pannable_zoomable_zoned_flow_canvas_renderer.tsx`

**Doc refs:**
- `runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`

**Sections:**
- # flow_canvas — Implementation: Code Architecture and Structure
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## ENTRY POINTS
- ## SCHEMA
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Flow Canvas
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Code refs:**
- `connectome_read_cli.py`

**Sections:**
- # flow_canvas — Patterns: Graph Node Visualization
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## SCOPE
- ## ENTRY POINTS
- ## MARKERS

**Code refs:**
- `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`

**Doc refs:**
- `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`
- `docs/connectome/flow_canvas/BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md`
- `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`
- `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`
- `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`
- `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
- `docs/connectome/flow_canvas/VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # flow_canvas — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## TODO
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## CONSCIOUSNESS TRACE
- ## POINTERS
- ## Agent Observations

**Sections:**
- # flow_canvas — Validation: Invariants for Readability and Render Stability
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## PROPERTIES
- ## INVARIANTS
- ## SYNC STATUS
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## MARKERS

**Sections:**
- # OBJECTIVES — Connectome Graph API
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)
- ## MARKERS

**Code refs:**
- `app/api/connectome/graph/route.ts`

**Sections:**
- # Connectome Graph API — Patterns: RESTful Graph Data Exposure
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## API ENDPOINTS
- ## MARKERS

**Code refs:**
- `app/api/connectome/graph/route.ts`
- `route.ts`

**Doc refs:**
- `docs/connectome/graph_api/SYNC_Graph_API.md`

**Sections:**
- # Connectome Graph API — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## IN PROGRESS
- ## RECENT CHANGES
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## TODO
- # No specific tests found for this module. Integration tests would be appropriate.
- # To test the API endpoint, one could run the Next.js app and make a GET request to /api/connectome/graph?graph=seed
- ## CONSCIOUSNESS TRACE
- ## POINTERS

**Sections:**
- # ALGORITHM: Proxying Graph Listing CLI
- ## CHAIN
- ## Overview
- ## Algorithm Steps
- ## Key Data Structures
- ## Complexity Considerations

**Sections:**
- # BEHAVIORS: Listing Available Connectome Graphs
- ## CHAIN
- ## Overview
- ## Behaviors

**Code refs:**
- `connectome_read_cli.py`
- `route.ts`

**Sections:**
- # IMPLEMENTATION: Connectome Graph Listing API Architecture
- ## CHAIN
- ## Overview
- ## Code Structure
- ## File Responsibilities
- ## Design Patterns
- ## Data Flow

**Code refs:**
- `app/api/connectome/graphs/route.ts`

**Sections:**
- # OBJECTIVES: Connectome Graphs Module
- ## Context
- ## Objectives
- ## Non-Objectives
- ## CHAIN

**Code refs:**
- `app/api/connectome/graphs/route.ts`
- `route.ts`

**Sections:**
- # PATTERNS: Connectome Graphs Module
- ## Context
- ## Patterns
- ## Anti-Patterns
- ## CHAIN

**Code refs:**
- `app/api/connectome/graphs/route.ts`

**Doc refs:**
- `docs/connectome/graphs/OBJECTIVES_Connectome_Graphs.md`
- `docs/connectome/graphs/PATTERNS_Connectome_Graphs.md`
- `docs/connectome/graphs/SYNC_Connectome_Graphs_Sync_Current_State.md`

**Sections:**
- # SYNC: Connectome Graphs Module Sync Current State
- ## Current State
- ## GAPS
- ## CONFLICTS
- ## CHAIN

**Code refs:**
- `connectome_read_cli.py`

**Sections:**
- # VALIDATION: Connectome Graph Listing Invariants
- ## CHAIN
- ## Overview
- ## Invariants (Must Always Be True)
- ## Verification Checks
- ## Edge Cases and Failure Modes

**Sections:**
- # Connectome Health SSE Payload (v0)

**Code refs:**
- `mind/health/activity_logger.py`
- `mind/health/connectome_health_service.py`
- `mind/infrastructure/orchestration/orchestrator.py`
- `mind/physics/tick.py`
- `tools/test_health_live.py`

**Sections:**
- # Connectome Activity Logging
- ## Overview
- ## Log Files
- ## Summary Log Format
- ## Detail Log Format
- ## Usage
- # Summary events
- # Detail events
- # Run ticks and generate logs
- # Watch logs in real-time
- ## Auto-Rotation
- ## Integration Points
- ## Customization
- ## Troubleshooting
- ## Related

**Code refs:**
- `app/connectome/components/connectome_health_panel.ts`

**Sections:**
- # Moment Graph Engine — HEALTH: Connectome Live Signals
- ## PURPOSE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## STATUS (RESULT INDICATOR)
- ## INDICATOR: query_write_attempts
- ## INDICATOR: interrupt_reason_stream
- ## INDICATOR: attention_sink_stats
- ## INDICATOR: focus_reconfig_rate
- ## INDICATOR: contradiction_pressure
- ## INDICATOR: async_epoch_mismatch
- ## INDICATOR: dmz_violation_attempts
- ## HOW TO RUN (MANUAL)
- ## DISPLAY (CONNECTOME PAGE)

**Sections:**
- # Integration Notes — Connectome Health (v0)
- ## Backend wiring (minimal)
- ## Frontend wiring (minimal)

**Sections:**
- # OBJECTIVES — Connectome Health
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # OBJECTIVES — Connectome Health Panel: Metrics Display and Realtime Feedback
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)
- ## MARKERS

**Code refs:**
- `app/connectome/components/connectome_health_panel.ts`

**Sections:**
- # Connectome Health Panel — Patterns: Live Monitoring and Invariants Visualization
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app/api/connectome/graph/route.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`

**Sections:**
- # log_panel — Algorithm: Rendering, Duration Coloring, Trigger Badges, and Export
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## DATA STRUCTURES
- ## ALGORITHM: `render_log_panel(store_state)`
- ## KEY DECISIONS
- ## DATA FLOW
- ## COMPLEXITY
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## ALGORITHM: `render_now_section(store_state)`
- ## ALGORITHM: `render_ledger_list(store_state)`
- ## ALGORITHM: duration formatting and coloring
- ## ALGORITHM: export
- ## MARKERS

**Sections:**
- # log_panel — Behaviors: Step Clarity and Copyable Audit Trail
- ## CHAIN
- ## OBJECTIVES SERVED
- ## INPUTS / OUTPUTS
- ## BEHAVIORS
- ## ANTI-BEHAVIORS
- ## EDGE CASES
- ## MARKERS

**Sections:**
- # log_panel — Health: Verification of Log Truth and Export Integrity
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: log_now_matches_last_event_integrity
- ## INDICATOR: log_duration_color_mapping_integrity
- ## INDICATOR: log_export_equals_ledger_integrity
- ## HOW TO RUN
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx`
- `app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`

**Sections:**
- # log_panel — Implementation: Component Structure and Serializer Integration
- ## CHAIN
- ## DESIGN PATTERNS
- ## SCHEMA
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CODE STRUCTURE
- ## ENTRY POINTS
- ## DATA FLOW
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Log Panel
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # log_panel — Patterns: Unified Explain + Copyable Event Ledger View
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app/api/connectome/graph/route.ts`
- `app/api/connectome/graphs/route.ts`
- `app/api/connectome/search/route.ts`
- `app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx`
- `app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`

**Doc refs:**
- `docs/connectome/log_panel/ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md`
- `docs/connectome/log_panel/BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md`
- `docs/connectome/log_panel/HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md`
- `docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md`
- `docs/connectome/log_panel/PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md`
- `docs/connectome/log_panel/SYNC_Connectome_Log_Panel_Sync_Current_State.md`
- `docs/connectome/log_panel/VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # log_panel — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## TODO
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## CONSCIOUSNESS TRACE
- ## POINTERS

**Sections:**
- # log_panel — Validation: Invariants for Truthful Durations and Stable Export
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## CHAIN
- ## INVARIANTS
- ## PROPERTIES
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # node_kit — Algorithm: Node Rendering Spec and Energy Glow Mapping
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## DATA STRUCTURES
- ## ALGORITHM: render_node
- ## KEY DECISIONS
- ## DATA FLOW
- ## HELPER FUNCTIONS
- ## ALGORITHM: map_energy_to_color
- ## ALGORITHM: wait_progress_display
- ## INTERACTIONS
- ## COMPLEXITY
- ## MARKERS

**Sections:**
- # node_kit - Behaviors: Visible Clarity and Trust Effects
- ## CHAIN
- ## OBJECTIVES SERVED
- ## BEHAVIORS
- ## ANTI-BEHAVIORS
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## MARKERS

**Sections:**
- # node_kit — Health: Runtime Verification of Node Signal Truthfulness
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: node_active_step_singularity_integrity
- ## INDICATOR: node_energy_color_bucket_integrity
- ## INDICATOR: node_wait_progress_clamp_integrity
- ## INDICATOR: node_tick_cron_progress_clamp_integrity
- ## HOW TO RUN
- # Run all node_kit health checks (highlight, energy, wait, tick)
- # Run a specific checker when you only touched one widget
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx`
- `app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.ts`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.ts`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.ts`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.ts`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`
- `connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `connectome_node_background_theme_tokens_by_type_and_language.ts`

**Doc refs:**
- `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`
- `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`
- `event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md`
- `runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`

**Sections:**
- # node_kit — Implementation: Component Map and Styling Tokens
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## SCHEMA
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## STYLING TOKENS (V1)
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Node Kit
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # node_kit — Patterns: Typed, Language-Coded, Energy-Aware Node Rendering
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## NODE TYPES (V1)
- ## DEPENDENCIES
- ## DATA
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Doc refs:**
- `docs/connectome/node_kit/BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md`
- `docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md`
- `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`
- `docs/connectome/node_kit/VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md`

**Sections:**
- # node_kit - Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## AGENT OBSERVATIONS
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## CONSCIOUSNESS TRACE
- ## POINTERS
- ## ARCHIVE

**Code refs:**
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx`
- `app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`

**Doc refs:**
- `docs/connectome/node_kit/ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md`
- `docs/connectome/node_kit/BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md`
- `docs/connectome/node_kit/HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md`
- `docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md`
- `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`
- `docs/connectome/node_kit/SYNC_Connectome_Node_Kit_Sync_Current_State.md`
- `docs/connectome/node_kit/VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # Archived: SYNC_Connectome_Node_Kit_Sync_Current_State.md
- ## RECENT CHANGES
- ## TODO

**Sections:**
- # node_kit — Validation: Invariants for Readability and Correct State Reflection
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## PROPERTIES
- ## INVARIANTS
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # page_shell — Algorithm: Control Dispatch and Layout Composition
- ## CHAIN
- ## NOTES

**Sections:**
- # page_shell — Behaviors: Stable Workflow and Mode Control Effects
- ## CHAIN
- ## NOTES

**Sections:**
- # page_shell — Health: Runtime Verification of Control Semantics and Mode Gating
- ## CHAIN
- ## NOTES

**Sections:**
- # page_shell — Implementation: Next.js Route and Component Wiring
- ## CHAIN
- ## NOTES

**Sections:**
- # OBJECTIVES — Page Shell
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Code refs:**
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.ts`

**Sections:**
- # page_shell — Patterns: Route Composition and User Control Surface
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `app/connectome/page.tsx`

**Sections:**
- # page_shell — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## TODO
- ## HANDOFF

**Sections:**
- # page_shell — Validation: Invariants for Control Correctness and No Drift
- ## CHAIN
- ## NOTES

**Sections:**
- # runtime_engine — Algorithm: Step Release Gate and Realtime Scheduling
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## ALGORITHM: `runtime_engine_step_release_and_realtime_scheduler()`
- ## DATA STRUCTURES
- ## ALGORITHM: `release_next_step()`
- ## ALGORITHM: `dispatch_runtime_command(cmd)`
- ## KEY DECISIONS
- ## DATA FLOW
- ## COMPLEXITY
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## MARKERS

**Sections:**
- # runtime_engine — Behaviors: User-Controlled Traversal and Playback Effects
- ## CHAIN
- ## BEHAVIORS
- ## OBJECTIVES SERVED
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## ANTI-BEHAVIORS
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # runtime_engine — Health: Verification Mechanics and Coverage
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: runtime_stepper_single_step_integrity
- ## INDICATOR: runtime_speed_authorization_separation
- ## INDICATOR: runtime_min_duration_enforced
- ## INDICATOR: runtime_autoplay_leak_detector
- ## HOW TO RUN
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `app/connectome/lib/connectome_step_script_sample_sequence.ts`
- `app/connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `app/connectome/lib/connectome_wait_timer_progress_and_tick_display_signal_selectors.ts`
- `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `app/connectome/page.tsx`
- `connectome_system_map_node_edge_manifest.ts`

**Sections:**
- # runtime_engine — Implementation: Code Architecture and Structure
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## SCHEMA
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Runtime Engine
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # runtime_engine — Patterns: Stepper-Gated Traversal and Realtime Playback Control
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## DATA STRUCTURES
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Code refs:**
- `app/connectome/lib/connectome_step_script_sample_sequence.ts`
- `app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy.ts`
- `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `app/connectome/lib/step_script_cursor_and_replay_determinism_helpers.ts`

**Doc refs:**
- `docs/connectome/runtime_mind/ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md`
- `docs/connectome/runtime_mind/BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md`
- `docs/connectome/runtime_mind/HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md`
- `docs/connectome/runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `docs/connectome/runtime_mind/PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md`
- `docs/connectome/runtime_mind/SYNC_Connectome_Runtime_Engine_Sync_Current_State.md`
- `docs/connectome/runtime_mind/VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # runtime_engine — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## RECENT CHANGES
- ## TODO
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## CONSCIOUSNESS TRACE
- ## POINTERS

**Sections:**
- # runtime_engine — Validation: Invariants for Stepper Gating and Realtime Playback
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## INVARIANTS
- ## PROPERTIES
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- # Run tests
- # Run with coverage
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Connectome Search API
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)
- ## MARKERS

**Code refs:**
- `app/api/connectome/search/route.ts`

**Sections:**
- # Connectome Search API — Patterns: API Gateway for Graph Search
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Sections:**
- # state_store — Algorithm: Atomic Commits for Releases, Focus, and Timers
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## DATA STRUCTURES
- ## ALGORITHM: `commit_step_release_append_event_and_set_focus_and_explanation(release)`
- ## ALGORITHM: `restart_session_clear_or_boundary()`
- ## ALGORITHM: `append_realtime_event_and_update_focus_if_needed(event)` (deferred)
- ## KEY DECISIONS
- ## DATA FLOW
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## ALGORITHM: wait progress computation (selector)
- ## COMPLEXITY
- ## MARKERS

**Sections:**
- # state_store — Behaviors: Observable Effects of a Single Canonical Store
- ## CHAIN
- ## OBJECTIVES SERVED
- ## BEHAVIORS
- ## EDGE CASES
- ## ANTI-BEHAVIORS
- ## INPUTS / OUTPUTS
- ## MARKERS

**Sections:**
- # state_store — Health: Verification Mechanics and Coverage
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: store_ledger_append_only_integrity
- ## INDICATOR: store_atomic_commit_integrity
- ## INDICATOR: store_single_focus_integrity
- ## INDICATOR: store_wait_timer_clamp_integrity
- ## INDICATOR: store_export_equals_ledger
- ## INDICATOR: store_restart_policy_consistency
- ## HOW TO RUN
- # Run all state_store health checks
- # Run a specific indicator checker only
- ## KNOWN GAPS
- ## MARKERS

**Sections:**
- # state_store — Implementation: Code Architecture and Structure
- ## CHAIN
- ## SCHEMA
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## STATE MANAGEMENT
- ## CONFIGURATION
- ## MODULE DEPENDENCIES
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## BIDIRECTIONAL LINKS
- ## MARKERS
- ## AGENT OBSERVATIONS

**Sections:**
- # OBJECTIVES — State Store
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # state_store — Patterns: Single Source of Truth for Ledger, Focus, and Timers
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## ENTRY POINTS (ACTIONS)
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## MARKERS

**Doc refs:**
- `docs/connectome/state_store/BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md`
- `docs/connectome/state_store/HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md`
- `docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `docs/connectome/state_store/PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md`

**Sections:**
- # state_store — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## IN PROGRESS
- ## KNOWN ISSUES
- ## TODO
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## POINTERS
- ## CONSCIOUSNESS TRACE
- ## ARCHIVE

**Code refs:**
- `app/connectome/lib/connectome_export_jsonl_and_text_log_serializer.ts`
- `app/connectome/lib/connectome_session_boundary_and_restart_policy_controller.ts`
- `app/connectome/lib/connectome_wait_timer_progress_and_tick_display_signal_selectors.ts`
- `app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`

**Doc refs:**
- `docs/connectome/state_store/ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md`
- `docs/connectome/state_store/BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md`
- `docs/connectome/state_store/HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md`
- `docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `docs/connectome/state_store/PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md`
- `docs/connectome/state_store/SYNC_Connectome_State_Store_Sync_Current_State.md`
- `docs/connectome/state_store/VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`

**Sections:**
- # Archived: SYNC_Connectome_State_Store_Sync_Current_State.md
- ## RECENT CHANGES
- ## AGENT OBSERVATIONS

**Sections:**
- # state_store — Validation: Invariants for Ledger, Focus, and Timers
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## INVARIANTS
- ## PROPERTIES
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # telemetry_adapter — Algorithm: SSE Subscribe, Parse, Envelope, Emit
- ## CHAIN
- ## DATA STRUCTURES
- ## ALGORITHM: `connect_to_sse_stream(stream_config)`
- ## ALGORITHM: `on_sse_message(frame) → RawTelemetryEnvelope`
- ## ALGORITHM: local pause buffering gate (owned jointly with runtime_engine)
- ## ALGORITHM: rate estimation (health signal)
- ## COMPLEXITY
- ## MARKERS

**Sections:**
- # telemetry_adapter — Behaviors: Realtime Ingestion, Buffering, and Backpressure Effects
- ## CHAIN
- ## BEHAVIORS
- ## ANTI-BEHAVIORS
- ## EDGE CASES
- ## MARKERS

**Sections:**
- # telemetry_adapter — Health: Stream Integrity, Parse Errors, Rate, and Buffer Bounds
- ## PURPOSE OF THIS FILE
- ## CHAIN
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## CHECKER INDEX
- ## HOW TO RUN
- ## KNOWN GAPS
- ## MARKERS

**Sections:**
- # telemetry_adapter — Implementation: Code Architecture and Structure
- ## CHAIN
- ## CODE STRUCTURE
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## MARKERS

**Sections:**
- # OBJECTIVES — Telemetry Adapter
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)

**Sections:**
- # telemetry_adapter — Patterns: SSE-to-FlowEvent Docking for Realtime Connectome Playback
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Sections:**
- # telemetry_adapter — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## TODO

**Sections:**
- # telemetry_adapter — Validation: Invariants for Stream Integrity, Ordering, and No Silent Drops
- ## CHAIN
- ## INVARIANTS
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- ## MARKERS

**Sections:**
- # VISUAL STYLE GUIDE: The Connectome
- ## Introduction: A Declaration of Intent
- ## 1. Aesthetic Manifesto: Physics Over Psychology
- ## 2. Color Palette: The Substance of the System
- ## 3. Typography & Iconography: The Written Record
- ## 4. Component Styling: Nodes, Edges, and the Ledger
- ## 5. Motion Physics: Weight, Friction, and Consequence

**Code refs:**
- `app/connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `lib/design/tokens.ts`

**Sections:**
- # Design Language Implementation
- ## File Structure
- ## Token Implementation
- ## Utility Functions
- ## Tailwind Integration
- ## CSS Custom Properties (Alternative)
- ## Usage Examples
- ## Migration from Current Code
- ## Open Questions

**Sections:**
- # Design Language Objectives
- ## Primary Goal
- ## Ranked Objectives
- ## Non-Goals
- ## Tradeoffs
- ## Design Tokens Required
- ## Dependencies

**Sections:**
- # Design Language System
- ## System Identity
- ## Design Philosophy
- ## Token Architecture
- ## Color System
- ## Typography
- ## Spacing
- ## Component Patterns
- ## Animation
- ## Layer Visual Language
- ## Graph Visual Language
- ## Open Questions

**Code refs:**
- `lib/design/index.ts`
- `lib/design/tokens.ts`
- `lib/design/utils.ts`

**Sections:**
- # Design Language — Sync
- ## Current State
- ## Documents
- ## Escalations Summary
- ## Implementation Status
- ## Dependencies
- ## Next Actions
- ## Handoff Notes

**Code refs:**
- `layout.tsx`

**Sections:**
- # BEHAVIORS — App Shell: Observable Effects and User Interactions
- ## CHAIN
- ## CORE BEHAVIORS

**Code refs:**
- `layout.tsx`

**Sections:**
- # OBJECTIVES — App Shell
- ## PRIMARY OBJECTIVES (ranked)
- ## NON-OBJECTIVES
- ## TRADEOFFS (canonical decisions)
- ## SUCCESS SIGNALS (observable)
- ## MARKERS

**Code refs:**
- `app/layout.ts`
- `app/layout.tsx`
- `app/page.ts`
- `app/page.tsx`
- `layout.tsx`
- `page.tsx`

**Sections:**
- # App Shell — Patterns: Consistent Layout and Global Functionality for Next.js Application
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Code refs:**
- `app.py`
- `app/api/route.ts`
- `app/layout.tsx`
- `app/mind/page.tsx`
- `app/page.tsx`
- `layout.tsx`
- `page.tsx`

**Doc refs:**
- `docs/frontend/app_shell/OBJECTIVES_App_Shell.md`
- `docs/frontend/app_shell/PATTERNS_App_Shell.md`
- `docs/frontend/app_shell/SYNC_App_Shell_State.md`

**Sections:**
- # App Shell — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## IN PROGRESS
- ## RECENT CHANGES
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## POINTERS
- ## TODO
- ## CONSCIOUSNESS TRACE

**Sections:**
- # Landing Page Algorithms
- ## Flow 1: Page Load
- ## Flow 2: Stats API
- ## Flow 3: Activity API
- ## Flow 4: Graph Preview Animation
- ## Flow 5: Count-Up Animation
- ## Flow 6: Navigation
- ## Server-Side Data (Optional)
- ## Caching Strategy
- ## Error Handling

**Sections:**
- # Landing Page Behaviors
- ## Entry Points
- ## Scroll Behaviors
- ## Navigation Behaviors
- ## Interactive Elements
- ## Loading States
- ## Error States
- ## Responsive Behaviors
- ## Accessibility
- ## Performance Targets

**Sections:**
- # Landing Page Health
- ## Health Signals
- ## Metrics to Track
- ## Analytics Events
- ## Error Tracking
- ## Performance Budgets
- ## Health Dashboard (Planned)
- ## Alerting Rules
- ## A/B Testing (Future)
- ## Current Implementation Status

**Sections:**
- # Landing Page Implementation
- ## File Structure
- ## Page Component
- ## Hero Component
- ## Graph Preview Component
- ## How It Works Component
- ## Stats Component
- ## API Routes
- ## Shared Constants
- ## Dependencies
- ## Build Considerations

**Sections:**
- # Landing Page Objectives
- ## Primary Goal
- ## Ranked Objectives
- ## Non-Goals
- ## Target Audiences
- ## Tradeoffs
- ## Success Metrics
- ## Content Requirements
- ## Visual Direction
- ## Dependencies

**Doc refs:**
- `docs/vision/PATTERNS_Platform_Vision_And_Architecture.md`

**Sections:**
- # Landing Page Design
- ## Page Identity
- ## Design Philosophy
- ## Page Structure
- ## Component Architecture
- ## Navigation Design
- ## Visual Design Tokens
- ## Graph Preview Options
- ## Responsive Breakpoints
- ## Animation
- ## Copy Direction
- ## Related

**Code refs:**
- `app/api/activity/route.ts`
- `app/api/stats/route.ts`
- `lib/constants/colors.ts`
- `page.tsx`

**Doc refs:**
- `docs/vision/SYNC_Platform_Vision.md`

**Sections:**
- # Landing Page — Sync
- ## Current State
- ## Implementation Status
- ## Open Questions
- ## Dependencies
- ## Next Actions
- ## Build Order Recommendation
- ## Handoff Notes
- ## Related

**Doc refs:**
- `docs/vision/VALIDATION_Platform_Invariants.md`

**Sections:**
- # Landing Page Invariants
- ## Content Invariants
- ## Data Invariants
- ## UI Invariants
- ## Performance Invariants
- ## Accessibility Invariants
- ## Navigation Invariants
- ## Security Invariants
- ## Related Invariants

**Sections:**
- # Nature — Algorithm: Choosing the Right Nature
- ## CHAIN
- ## PURPOSE
- ## DECISION TREE
- ## STEP BY STEP
- # Task both uses a skill AND executes a procedure
- ## COMMON PATTERNS
- # Always: instance -[serves]-> template
- # Actor claims work
- # Task concerns target
- # Task resolves problem
- # Doc describes code
- # Code imports dependency
- # Parent includes child
- ## WHEN UNSURE
- ## MARKERS

**Sections:**
- # Nature — Behaviors: Observable Effects
- ## CHAIN
- ## PURPOSE
- ## B1: Link with `serves`
- ## B2: Link with `concerns`
- ## B3: Link with `claims`
- ## B4: Link with `resolves`
- ## B5: Link with `blocks`
- ## B6: Link with `includes`
- ## B7: Link with `uses`
- ## B8: Link with `executes`
- ## B9: Link with `imports`
- ## B10: Link with `is about`
- ## QUERY BEHAVIORS
- ## MARKERS

**Sections:**
- # Nature — Health: Verifying Correct Usage
- ## CHAIN
- ## PURPOSE
- ## INDICATORS
- ## HOW TO RUN
- # Check nature health (via MCP)
- ## MARKERS

**Sections:**
- # Nature — Implementation: Where Nature Lives
- ## CHAIN
- ## PURPOSE
- ## FILE STRUCTURE
- ## NATURE IN MCP CALLS
- # Creating a link
- ## TRANSPARENCY PRINCIPLE
- ## MARKERS

**Sections:**
- # Nature — Objectives
- ## CHAIN
- ## PURPOSE
- ## RANKED OBJECTIVES
- ## NON-OBJECTIVES
- ## SUCCESS CRITERIA

**Sections:**
- # Nature — Patterns: Semantic Link Vocabulary
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## PRINCIPLES
- ## CORE NATURE VALUES
- ## SCOPE
- ## MARKERS

**Sections:**
- # Nature — Sync
- ## CHAIN
- ## CURRENT STATE
- ## RECENT CHANGES
- ## NEXT STEPS
- ## HANDOFF

**Sections:**
- # Nature — Validation: What Makes Valid Nature Usage
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- # missing nature
- ## VALIDATION CHECKS
- ## ERROR MESSAGES
- ## MARKERS

**Sections:**
- # Nature — Vocabulary: The Stimulus Field
- ## CHAIN
- ## PURPOSE
- ## WHAT IS NATURE
- # Link nature
- # Node nature (in content/metadata)
- ## NATURE VOCABULARY
- # Pre-modifiers (before verb)
- # Post-modifiers (after verb with comma)
- ## USAGE EXAMPLES
- # The task_run node
- # Link to template
- # Link to target
- ## CHOOSING NATURE
- ## ANTI-PATTERNS
- # WRONG - nature is not metadata
- # RIGHT - nature describes stimulus type
- # Put metadata in node properties
- ## MARKERS

**Code refs:**
- `app/mind/page.ts`

**Sections:**
- # Mind Feature — Algorithm: Delegated Rendering of Connectome Shell
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## DATA STRUCTURES
- ## ALGORITHM: `MindPage()`
- ## KEY DECISIONS
- ## DATA FLOW
- ## COMPLEXITY
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## MARKERS

**Code refs:**
- `app/mind/page.ts`

**Sections:**
- # Mind Feature — Behaviors: Placeholder Page Rendering Connectome Shell
- ## CHAIN
- ## BEHAVIORS
- ## OBJECTIVES SERVED
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## ANTI-BEHAVIORS

**Sections:**
- # OBJECTIVES: Mind Feature
- ## Chain
- ## 1. Purpose
- ## 2. Current State
- ## 3. Future Intent

**Code refs:**
- `app/mind/page.tsx`

**Sections:**
- # PATTERNS: Mind Feature
- ## Chain
- ## 1. Structural Patterns
- ## 2. Integration Patterns
- ## 3. Future Patterns (Anticipated)

**Code refs:**
- `app/mind/page.tsx`

**Sections:**
- # SYNC: Mind Feature State
- ## Chain
- ## 1. Current Status
- ## 2. Decisions
- ## 3. Open Questions/Next Steps

**Code refs:**
- `app/mind/page.ts`

**Sections:**
- # Mind Feature — Validation: Placeholder Page Delegation
- ## CHAIN
- ## BEHAVIORS GUARANTEED
- ## OBJECTIVES COVERED
- ## INVARIANTS
- ## PROPERTIES
- ## ERROR CONDITIONS
- ## HEALTH COVERAGE
- ## VERIFICATION PROCEDURE
- # No automated tests are currently defined for the MindPage due to its placeholder nature.
- # Future tests would involve:
- # - Jest/React Testing Library: To assert that ConnectomePageShell is rendered.
- # - Cypress/Playwright: To perform end-to-end tests for navigation and UI presence.
- ## SYNC STATUS
- ## MARKERS

**Sections:**
- # Registry Module Algorithms
- ## Flow 1: Load Registry List
- ## Flow 2: Search Registry
- ## Flow 3: View Entity Detail
- ## Flow 4: Derive Verification State
- # Find the most authoritative link
- # (highest permanence among positive polarity)
- # Check for rejection
- # Determine verified vs provisional
- ## Flow 5: Filter List
- ## Flow 6: Navigate to Related Entity
- ## Flow 7: Open in Connectome
- ## Data Transformation
- ## Caching Logic

**Sections:**
- # Registry Module Behaviors
- ## Entry Points
- ## List View Behaviors
- ## Detail View Behaviors
- ## Loading States
- ## Error States
- ## Responsive Behavior
- ## Keyboard Navigation
- ## Accessibility

**Sections:**
- # Registry Module Health
- ## Health Signals
- ## Health Check Endpoint
- ## UI Health Indicators
- ## Error Tracking
- ## Metrics to Track
- ## Alerting Rules
- ## Runbooks
- ## Current Implementation Status

**Sections:**
- # Registry Module Implementation
- ## File Structure
- ## Types
- ## API Client
- ## React Hooks
- ## API Routes
- ## Component Examples
- ## Data Flow
- ## Dependencies

**Sections:**
- # Registry Module Objectives
- ## Primary Goal
- ## Ranked Objectives
- ## Non-Goals
- ## Tradeoffs
- ## Success Metrics
- ## Dependencies

**Doc refs:**
- `docs/vision/VALIDATION_Platform_Invariants.md`
- `docs/vision/VOCABULARY_Platform_Terms.md`

**Sections:**
- # Registry Module Design
- ## Module Identity
- ## Design Philosophy
- ## Data Model (from L4)
- ## Component Architecture
- ## API Design
- ## Visual Design
- ## Caching Strategy
- ## Open Questions
- ## Related

**Sections:**
- # Registry Patterns — L4 Rules
- ## Les 9 Rules
- ## Pourquoi cet ensemble est solide
- ## Le Pattern Clé: Graph Physics
- ## Application aux Procédures
- # P7: Membrane only
- # P8: Graph MCP calls (pas de Cypher)
- # P9: Traceable
- ## Anti-patterns

**Code refs:**
- `app/api/registry/citizens/route.ts`
- `app/api/registry/health/route.ts`
- `app/api/registry/orgs/route.ts`
- `app/api/registry/search/route.ts`
- `lib/api.ts`
- `lib/constants/colors.ts`
- `lib/types.ts`
- `page.tsx`

**Doc refs:**
- `docs/vision/SYNC_Platform_Vision.md`

**Sections:**
- # Registry Module — Sync
- ## Current State
- ## Implementation Status
- ## Open Questions
- ## Dependencies
- ## Next Actions
- ## Handoff Notes
- ## Related

**Doc refs:**
- `docs/vision/VALIDATION_Platform_Invariants.md`

**Sections:**
- # Registry Module Invariants
- ## Data Invariants
- ## UI Invariants
- ## API Invariants
- ## Performance Invariants
- ## Security Invariants
- ## Related Invariants

**Sections:**
- # UX Module Objectives
- ## Primary Goal
- ## Ranked Objectives
- ## Non-Goals
- ## Tradeoffs
- ## User Journeys
- ## Interaction Patterns
- ## Open Questions

**Doc refs:**
- `docs/landing/BEHAVIORS_Landing_UX.md`
- `docs/registry/BEHAVIORS_Registry_UX.md`

**Sections:**
- # UX Patterns
- ## Core Principles
- ## Navigation Patterns
- ## Selection Patterns
- ## Action Patterns
- ## Feedback Patterns
- ## Form Patterns
- ## Graph-Specific Patterns
- ## Responsive Patterns
- ## Accessibility Patterns
- ## Related

**Sections:**
- # UX Module — Sync
- ## Current State
- ## Escalations Summary
- ## Implementation Status
- ## Next Actions
- ## Related

**Sections:**
- # Platform Algorithms
- ## Core Flows
- ## Authentication Flows
- ## Registry Flows
- ## Marketplace Flows
- ## Wallet Flows
- ## Emerging Module Identification

**Sections:**
- # Platform Behaviors
- ## Layer Navigation
- ## Graph Interaction
- ## Authentication States
- ## Data Verification
- ## Error States
- ## Performance

**Sections:**
- # Platform Health
- ## Health Signals
- ## Health Endpoints
- ## Monitoring Dashboard (Planned)
- ## Runtime Assertions (Dev Mode)
- ## Error Tracking
- ## Health Checks by Module
- ## Incident Response
- ## Current Health Status

**Code refs:**
- `lib/api/client.ts`
- `lib/constants/colors.ts`

**Sections:**
- # Platform Implementation
- ## Repository Structure
- ## Module Architecture
- ## Shared Infrastructure
- ## Data Flow
- ## Emerging Modules Summary

**Sections:**
- # Platform Objectives
- ## Primary Goal
- ## Ranked Objectives
- ## Non-Goals
- ## Tradeoffs
- ## Success Criteria

**Sections:**
- # Mind Platform — Vision & Architecture
- ## The Big Picture
- ## The 4-Layer Architecture
- ## The Membrane Network
- ## Platform's Role
- ## Repository Ecosystem
- ## Current State
- ## Design Principles
- ## Next Steps
- ## Related Documents

**Sections:**
- # Platform Vision — Sync
- ## Current State
- ## Doc Chain Status
- ## Emerging Modules
- ## Module Doc Chain Template
- ## Next Actions
- ## Vocabulary Contributions
- ## Architecture Decisions
- ## Open Questions
- ## Handoff Notes

**Sections:**
- # Platform Validation
- ## Data Integrity Invariants
- ## UI Consistency Invariants
- ## Navigation Invariants
- ## Performance Invariants
- ## API Contract Invariants
- ## Security Invariants
- ## Emerging Module Invariants
- ## Verification Methods

**Sections:**
- # Platform Vocabulary
- ## Imported from L4 (mind-protocol)
- ## Platform-Specific Terms
- ## L3 Ecosystem Terms
- ## Wallet Terms
- ## Emerging Modules
- ## Source Documents

**Sections:**
- # mind-platform Architecture
- ## Layer Position: L3 (Ecosystem) + Frontend
- ## Core Responsibilities
- ## Key Design Decisions
- ## Module Structure
- ## Tech Stack
- ## Data Flow
- ## Frontend Features
- ## Related Repos

**Code refs:**
- `__init__.py`
- `api/connectome/graph/route.ts`
- `api/connectome/graphs/route.ts`
- `api/connectome/search/route.ts`
- `api/sse/route.ts`
- `api/stats/route.ts`
- `app.py`
- `app/api/activity/route.ts`
- `app/api/connectome/graph/route.ts`
- `app/api/connectome/graphs/route.ts`
- `app/api/connectome/search/route.ts`
- `app/api/registry/citizens/route.ts`
- `app/api/registry/health/route.ts`
- `app/api/registry/orgs/route.ts`
- `app/api/registry/search/route.ts`
- `app/api/route.ts`
- `app/api/stats/route.ts`
- `app/connectome/components/connectome_health_panel.ts`
- `app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx`
- `app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts`
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.ts`
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts`
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx`
- `app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.ts`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.ts`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.ts`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.ts`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.ts`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `app/connectome/components/telemetry_camera_controls.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`
- `app/connectome/lib/connectome_export_jsonl_and_text_log_serializer.ts`
- `app/connectome/lib/connectome_session_boundary_and_restart_policy_controller.ts`
- `app/connectome/lib/connectome_step_script_sample_sequence.ts`
- `app/connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `app/connectome/lib/connectome_wait_timer_progress_and_tick_display_signal_selectors.ts`
- `app/connectome/lib/flow_event_duration_bucket_color_classifier.ts`
- `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`
- `app/connectome/lib/flow_event_trigger_and_calltype_inference_rules.ts`
- `app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy.ts`
- `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `app/connectome/lib/step_script_cursor_and_replay_determinism_helpers.ts`
- `app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- `app/connectome/page.tsx`
- `app/layout.ts`
- `app/layout.tsx`
- `app/mind/page.ts`
- `app/mind/page.tsx`
- `app/page.ts`
- `app/page.tsx`
- `base.py`
- `camelCase.ts`
- `claim.py`
- `connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- `connectome_edge_directional_shine_animation_helpers.ts`
- `connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `connectome_node_background_theme_tokens_by_type_and_language.ts`
- `connectome_node_boundary_intersection_geometry_helpers.ts`
- `connectome_read_cli.py`
- `connectome_system_map_node_edge_manifest.ts`
- `detection.py`
- `dispatch.py`
- `doctor_cli_parser_and_run_checker.py`
- `execution.py`
- `flow_event_schema_and_normalization_contract.ts`
- `grammar/claim.py`
- `grammar/detection.py`
- `grammar/execution.py`
- `grammar/resolution.py`
- `grammar/verification.py`
- `layout.tsx`
- `lib/api.ts`
- `lib/api/client.ts`
- `lib/constants/colors.ts`
- `lib/design/index.ts`
- `lib/design/tokens.ts`
- `lib/design/utils.ts`
- `lib/types.ts`
- `lib/utils.ts`
- `loader.py`
- `mcp/health.py`
- `mcp/server.py`
- `mind/health/activity_logger.py`
- `mind/health/connectome_health_service.py`
- `mind/infrastructure/orchestration/orchestrator.py`
- `mind/physics/tick.py`
- `page.tsx`
- `pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `path/to/file.py`
- `registry.py`
- `route.ts`
- `runtime/capability/base.py`
- `runtime/capability/dispatch.py`
- `runtime/capability/loader.py`
- `runtime/capability/registry.py`
- `runtime/checks.py`
- `runtime/grammar/claim.py`
- `runtime/grammar/detection.py`
- `runtime/grammar/execution.py`
- `runtime/grammar/resolution.py`
- `runtime/ingest/docs.py`
- `semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`
- `src/auth/login.py`
- `src/old_module.py`
- `task_query.py`
- `task_state.py`
- `tools/test_health_live.py`

**Doc refs:**
- `docs/MAPPING.md`
- `docs/TAXONOMY.md`
- `docs/connectome/edge_kit/BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md`
- `docs/connectome/edge_kit/HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md`
- `docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md`
- `docs/connectome/edge_kit/PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md`
- `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
- `docs/connectome/edge_kit/VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md`
- `docs/connectome/event_model/ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md`
- `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`
- `docs/connectome/flow_canvas/BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md`
- `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`
- `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`
- `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`
- `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
- `docs/connectome/flow_canvas/VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md`
- `docs/connectome/graph_api/SYNC_Graph_API.md`
- `docs/connectome/graphs/OBJECTIVES_Connectome_Graphs.md`
- `docs/connectome/graphs/PATTERNS_Connectome_Graphs.md`
- `docs/connectome/graphs/SYNC_Connectome_Graphs_Sync_Current_State.md`
- `docs/connectome/log_panel/ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md`
- `docs/connectome/log_panel/BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md`
- `docs/connectome/log_panel/HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md`
- `docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md`
- `docs/connectome/log_panel/PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md`
- `docs/connectome/log_panel/SYNC_Connectome_Log_Panel_Sync_Current_State.md`
- `docs/connectome/log_panel/VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md`
- `docs/connectome/node_kit/ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md`
- `docs/connectome/node_kit/BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md`
- `docs/connectome/node_kit/HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md`
- `docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md`
- `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`
- `docs/connectome/node_kit/SYNC_Connectome_Node_Kit_Sync_Current_State.md`
- `docs/connectome/node_kit/VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md`
- `docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md`
- `docs/connectome/runtime_mind/ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md`
- `docs/connectome/runtime_mind/BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md`
- `docs/connectome/runtime_mind/HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md`
- `docs/connectome/runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `docs/connectome/runtime_mind/PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md`
- `docs/connectome/runtime_mind/SYNC_Connectome_Runtime_Engine_Sync_Current_State.md`
- `docs/connectome/runtime_mind/VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md`
- `docs/connectome/state_store/ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md`
- `docs/connectome/state_store/BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md`
- `docs/connectome/state_store/HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md`
- `docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `docs/connectome/state_store/PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md`
- `docs/connectome/state_store/SYNC_Connectome_State_Store_Sync_Current_State.md`
- `docs/connectome/state_store/VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md`
- `docs/frontend/app_shell/OBJECTIVES_App_Shell.md`
- `docs/frontend/app_shell/PATTERNS_App_Shell.md`
- `docs/frontend/app_shell/SYNC_App_Shell_State.md`
- `docs/landing/BEHAVIORS_Landing_UX.md`
- `docs/landing/IMPLEMENTATION_Landing_Code.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`
- `docs/physics/subentity/ALGORITHM_SubEntity.md`
- `docs/physics/subentity/BEHAVIORS_SubEntity.md`
- `docs/physics/subentity/VALIDATION_SubEntity.md`
- `docs/registry/BEHAVIORS_Registry_UX.md`
- `docs/registry/IMPLEMENTATION_Registry_Code.md`
- `docs/schema/PATTERNS_Schema.md`
- `docs/ux/PATTERNS_UX_Principles.md`
- `docs/vision/PATTERNS_Platform_Vision_And_Architecture.md`
- `docs/vision/SYNC_Platform_Vision.md`
- `docs/vision/VALIDATION_Platform_Invariants.md`
- `docs/vision/VOCABULARY_Platform_Terms.md`
- `event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md`
- `runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `skills/SKILL_fix_procedure.md`
- `skills/SKILL_solve_markers.md`
- `skills/SKILL_update_sync.md`
- `state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `tasks/TASK_*.md`

**Sections:**
- # Repository Map: mind-platform

**Definitions:**
- `alpha()`
- `getLayerColor()`
- `getNodeTypeColor()`
- `getVerificationColor()`
- `getStatusColor()`

**Definitions:**
- `class AgentMode`
- `class AgentStatus`
- `class AgentState`
- `def seconds_since_heartbeat()`
- `def to_dict()`
- `class AgentConfig`
- `class AgentRegistry`
- `def __init__()`
- `def register()`
- `def heartbeat()`
- `def claim_task()`
- `def complete_task()`
- `def fail_task()`
- `def unregister()`
- `def check_stuck()`
- `def list_agents()`
- `def get_agent()`
- `def count_by_status()`
- `class AgentController`
- `def __init__()`
- `def mode()`
- `def pause()`
- `def stop()`
- `def kill()`
- `def enable()`
- `def can_claim()`
- `def can_continue_step()`
- `def must_stop_now()`
- `def get_status()`
- `def get_registry()`
- `def get_controller()`
- `def reset_agents()`

**Definitions:**
- `class CheckContext`
- `def project_root()`
- `def list_files()`
- `def read_file()`
- `def file_exists()`
- `def query_graph()`
- `def log()`

**Definitions:**
- `def chain_completeness()`
- `class Signal`
- `def healthy()`
- `def degraded()`
- `def critical()`
- `def check()`
- `def decorator()`
- `class triggers`
- `class file`
- `def on_delete()`
- `def on_create()`
- `def on_modify()`
- `def on_move()`
- `class event`
- `def on()`
- `def after_ingest()`
- `class hook`
- `def on()`
- `def post_commit()`
- `def pre_commit()`
- `class init`
- `def after_scan()`
- `def startup()`
- `class cron`
- `def daily()`
- `def weekly()`
- `def hourly()`
- `def every()`
- `class git`
- `def post_commit()`
- `def pre_commit()`
- `class ci`
- `def pull_request()`
- `def push()`
- `class manual`
- `def invoke()`
- `class graph`
- `def on_node_create()`
- `def on_link_create()`
- `class stream`
- `def on_error()`
- `def on_pattern()`

**Definitions:**
- `def check_circuit_breaker()`
- `def record_circuit_breaker_failure()`
- `def is_capability_disabled()`
- `def enable_capability()`
- `def get_disabled_capabilities()`
- `def timeout()`
- `def handler()`
- `def dispatch_trigger()`
- `def handle_atomic_problem()`
- `def create_task_runs()`
- `def run_checks()`

**Definitions:**
- `class TaskStatus`
- `def create_task_run()`
- `def claim_task()`
- `def start_task()`
- `def complete_task()`
- `def fail_task()`
- `def release_task()`
- `def query_pending_tasks()`
- `class ActorStatus`
- `def update_actor_heartbeat()`
- `def set_actor_working()`
- `def set_actor_idle()`
- `def detect_stuck_agents()`
- `def cleanup_dead_agent()`

**Definitions:**
- `def load_checks()`
- `def discover_capabilities()`

**Definitions:**
- `class TriggerRegistry`
- `def __init__()`
- `def register()`
- `def register_check()`
- `def get_checks()`
- `def get_all_triggers()`
- `def get_stats()`

**Definitions:**
- `class ThrottlerConfig`
- `class TaskSlot`
- `class Throttler`
- `def __init__()`
- `def can_create()`
- `def can_claim()`
- `def register_create()`
- `def register_claim()`
- `def on_complete()`
- `def on_abandon()`
- `def _prune_old_timestamps()`
- `def get_stats()`
- `def get_throttler()`
- `def reset_throttler()`

**Sections:**
- # Architect
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Fixer
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Groundwork
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Herald
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Keeper
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Scout
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Steward
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Voice
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Weaver
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Sections:**
- # Witness
- ## Purpose
- ## Capabilities
- ## Triggers
- ## Implementation
- ## Complements

**Code refs:**
- `{path/to/main/source/file.py`

**Sections:**
- # {Module Name} — Algorithm: {Brief Description of Procedures and Logic}
- ## CHAIN
- ## OVERVIEW
- ## OBJECTIVES AND BEHAVIORS
- ## DATA STRUCTURES
- ## ALGORITHM: {Primary Function Name}
- ## KEY DECISIONS
- ## DATA FLOW
- ## COMPLEXITY
- ## HELPER FUNCTIONS
- ## INTERACTIONS
- ## MARKERS

**Code refs:**
- `{path/to/main/source/file.py`

**Sections:**
- # {Module Name} — Behaviors: {Brief Description of Observable Effects}
- ## CHAIN
- ## BEHAVIORS
- ## OBJECTIVES SERVED
- ## INPUTS / OUTPUTS
- ## EDGE CASES
- ## ANTI-BEHAVIORS
- ## MARKERS

**Sections:**
- # {Module} — Health: Verification Mechanics and Coverage
- ## WHEN TO USE HEALTH (NOT TESTS)
- ## PURPOSE OF THIS FILE
- ## WHY THIS PATTERN
- ## HOW TO USE THIS TEMPLATE
- ## CHAIN
- ## IMPLEMENTS
- ## FLOWS ANALYSIS (TRIGGERS + FREQUENCY)
- ## HEALTH INDICATORS SELECTED
- ## OBJECTIVES COVERAGE
- ## STATUS (RESULT INDICATOR)
- ## DOCK TYPES (COMPLETE LIST)
- ## CHECKER INDEX
- ## INDICATOR: {Indicator Name}
- # ... check logic ...
- ## HOW TO RUN
- # Run all health checks for this module
- # Run a specific checker
- ## KNOWN GAPS
- ## MARKERS

**Code refs:**
- `{path/to/main/source/file.py`

**Sections:**
- # {Module} — Implementation: Code Architecture and Structure
- ## CHAIN
- ## CODE STRUCTURE
- ## DESIGN PATTERNS
- ## SCHEMA
- ## ENTRY POINTS
- ## DATA FLOW AND DOCKING (FLOW-BY-FLOW)
- ## LOGIC CHAINS
- ## MODULE DEPENDENCIES
- ## STATE MANAGEMENT
- ## RUNTIME BEHAVIOR
- ## CONCURRENCY MODEL
- ## CONFIGURATION
- ## BIDIRECTIONAL LINKS
- ## EXTRACTION CANDIDATES
- ## MARKERS

**Sections:**
- # {Project} — Mapping: Translation to mind Schema
- ## PURPOSE
- ## MIND UNIVERSAL SCHEMA
- ## NODE MAPPINGS
- ## LINK MAPPINGS
- ## COMMON PATTERNS
- ## MARKERS

**Code refs:**
- `{path/to/main/source/file.py`

**Sections:**
- # {Module Name} — Patterns: {Brief Design Philosophy Description}
- ## CHAIN
- ## THE PROBLEM
- ## THE PATTERN
- ## BEHAVIORS SUPPORTED
- ## BEHAVIORS PREVENTED
- ## PRINCIPLES
- ## DATA
- ## DEPENDENCIES
- ## INSPIRATIONS
- ## SCOPE
- ## MARKERS

**Sections:**
- # {Module/Area/Project} — Sync: Current State
- ## MATURITY
- ## CURRENT STATE
- ## IN PROGRESS
- ## RECENT CHANGES
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## TODO
- ## CONSCIOUSNESS TRACE
- ## POINTERS

**Sections:**
- # {Project} — Taxonomy: Domain Vocabulary
- ## PURPOSE
- ## TERMS
- ## TERMINOLOGY DECISIONS
- ## META-ATTRIBUTE DEFINITIONS
- ## MARKERS

**Sections:**
- # {Module Name} — Validation: What Must Be True
- ## CHAIN
- ## PURPOSE
- ## INVARIANTS
- ## PRIORITY
- ## INVARIANT INDEX
- ## MARKERS

**Doc refs:**
- `docs/MAPPING.md`
- `docs/TAXONOMY.md`

**Sections:**
- # {Module Name} — Vocabulary: New Terms
- ## CHAIN
- ## PURPOSE
- ## NEW TERMS
- ## NEW RELATIONSHIPS
- ## TASKS
- ## ACTORS
- ## PROBLEMS
- # critical = blocks work, must fix immediately
- # warning = degraded state, should fix soon
- # info = notable condition, fix when convenient
- # Task template that fixes this problem
- # Full detection logic goes in HEALTH.md
- ## TERMINOLOGY PROPOSALS
- ## MERGE STATUS
- ## MARKERS

**Sections:**
- ## 4. Protocol-First Reading
- ## 5. Parallel Work Awareness
- ## 6. Operational Proactivity
- ## 5. Communication Principles

**Sections:**
- ## GEMINI Agent Operating Principles (Derived from mind Protocol)
- ## Operational Directives

**Sections:**
- # {{PROJECT_NAME}}
- ## Before Any Task
- ## After Any Change
- ## Architecture
- ## Key Files
- ## MCP Tools

**Sections:**
- # Skill: `mind.add_cluster`
- ## Maps to VIEW
- ## Purpose
- ## When to Use
- ## Inputs
- ## Outputs
- ## Protocols
- ## Atomicity
- ## Link Requirements by Subtype
- ## Valid Link Targets
- # narrative.health can link to:
- # narrative.validation can link to:
- # thing.dock can link to:
- ## Design vs Implementation
- # Both required - health verifies the design via the implementation
- ## Protocol Composition
- ## Cluster Templates
- ## Pre-Commit Validation
- ## Cluster Design Knowledge
- ## Link Types (from schema)
- ## Semantic Properties on `relates`
- # This validation ensures that behavior
- # This narrative contradicts that one
- # Health indicator verifies validation
- ## Node Type Reference (from schema)
- ## Quality Criteria
- ## Process
- ## Gates
- ## Evidence & Referencing
- ## Markers
- ## Never-stop Rule
- ## Existing Node Discovery
- ## Connectivity Metrics
- # objectives are roots, fewer incoming links expected
- ## Scenario Examples
- # Total existing: 7 nodes
- # Total new: 4 nodes
- # Missing: docks!
- # Total existing: 6 nodes
- # Total new: 2 nodes
- # Total existing: 6 nodes
- # Total new: 2 nodes
- ## Protocol Feedback
- ## Connectivity Thresholds
- ## Summary of Cluster Rules
- ## CHAIN

**Doc refs:**
- `docs/physics/subentity/ALGORITHM_SubEntity.md`
- `docs/physics/subentity/BEHAVIORS_SubEntity.md`
- `docs/physics/subentity/VALIDATION_SubEntity.md`

**Sections:**
- # Skill: `mind.assess_subentity_exploration`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Diagnostic Layers
- ## Process
- ## Common Patterns
- ## Report Template
- # Exploration Diagnosis: {exploration_id}
- ## Symptom
- ## Expected Outcome
- ## Diagnosis
- ## Root Cause
- ## Improvements
- ## Follow-up Actions
- ## Procedures Referenced
- ## Evidence
- ## Never-stop

**Sections:**
- # Skill: `mind.author_procedures`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- # Part 1: Question Design
- ## The Core Idea
- ## Question Anatomy
- ## Example: Rich Question
- ## The Comment Field
- ## Question Flow
- ## Context Injection
- ## Guidance Types
- ## Comment → Moment Chain
- ## Dense Linking Through Questions
- ## Answer Creation Guidance
- ## Question Design Summary
- # Part 2: Protocol Structure
- ## Gates
- ## Process
- ## Protocol Template
- # ... batch 3-7 questions
- # fields...
- ## Step Types
- # Part 3: Contextual Knowledge
- ## Contextual Knowledge Examples
- # Part 4: Verification
- ## Verification Checklist
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Sections:**
- # Skill: `mind.author_skills`
- ## Maps to VIEW
- ## Context
- ## Pre-flight
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Complexity Tiers
- ## Signals: Overcomplicating
- ## Membrane Integration
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Sections:**
- # Skill: `mind.author_agents`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Agent Set Design
- ## Anti-patterns
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Sections:**
- # Skill: `mind.create_module_documentation`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Sections:**
- # Skill: `mind.health_define_and_verify`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Doc refs:**
- `docs/schema/PATTERNS_Schema.md`

**Sections:**
- # Skill: `mind.module_define_boundaries`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- # ID follows convention: {node-type}_{SUBTYPE}_{instance}
- # Example: space_MODULE_engine-physics
- # ID: narrative_OBJECTIVE_{module}-{type}
- # Example: narrative_OBJECTIVE_engine-physics-documented
- ## Gates
- ## Process
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Sections:**
- # Skill: `mind.ingest_docs_to_graph`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- # Space contains doc
- # Chain ordering (if previous doc exists)
- ## Procedures Referenced
- ## Quality Criteria
- ## Skill Markers

**Sections:**
- # Skill: `mind.orchestrate_feature_integration`
- ## Maps to VIEW
- ## Context
- ## Purpose
- ## Inputs
- ## Outputs
- ## Gates
- ## Process
- ## Skills Called
- ## Procedures Referenced
- ## Evidence
- ## Markers
- ## Never-stop

**Code refs:**
- `lib/constants/colors.ts`

**Sections:**
- # Project — Sync: Current State
- ## CURRENT STATE
- ## ACTIVE WORK
- ## RECENT CHANGES
- ## KNOWN ISSUES
- ## HANDOFF: FOR AGENTS
- ## HANDOFF: FOR HUMAN
- ## TODO
- ## CONSCIOUSNESS TRACE
- ## AREAS
- ## MODULE COVERAGE
- ## Init: 2025-12-29 02:13

**Code refs:**
- `doctor_cli_parser_and_run_checker.py`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`

**Sections:**
- # mind Framework
- ## WHY THIS PROTOCOL EXISTS
- ## ARCHITECTURE: 4 LAYERS
- ## COMPANION: PRINCIPLES.md
- ## THE CORE INSIGHT
- ## HOW TO USE THIS
- ## FILE TYPES AND THEIR PURPOSE
- ## KEY PRINCIPLES (from PRINCIPLES.md)
- ## STRUCTURING YOUR DOCS
- ## WHEN DOCS DON'T EXIST
- ## THE DOCUMENTATION PROCESS
- ## Maturity
- ## NAMING ENGINEERING PRINCIPLES
- ## MARKERS
- ## CLI COMMANDS
- # Run scripts with local runtime
- # my_script.py - imports work normally
- ## MCP MEMBRANE TOOLS
- ## MIND UNIVERSAL SCHEMA
- ## THE PROTOCOL IS A TOOL

**Sections:**
- # Working Principles
- ## Architecture: One Solution Per Problem
- ## Verification: Test Before Claiming Built
- ## Communication: Depth Over Brevity
- ## Quality: Never Degrade
- ## Code Discipline: No Safety Theater
- ## Experience: User Before Infrastructure
- ## Doc Chain First: Read Before Acting
- ## Feedback Loop: Human-Agent Collaboration
- ## How These Principles Integrate

**Sections:**
- # SYSTEM: Architecture Rules
- ## Overview
- ## 1. ACTORS
- ## 2. GRAPH PHYSICS
- ## 3. AGENTS (Skills + Procedures)
- ## Mapping: Old Checks → New Layer
- ## Flow Example
- ## Implementation Phases
- ## Summary

**Code refs:**
- `doctor_cli_parser_and_run_checker.py`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`

**Sections:**
- # mind-platform - Agent Instructions
- # Working Principles
- ## Architecture: One Solution Per Problem
- ## Verification: Test Before Claiming Built
- ## Communication: Depth Over Brevity
- ## Quality: Never Degrade
- ## Code Discipline: No Safety Theater
- ## Experience: User Before Infrastructure
- ## Feedback Loop: Human-Agent Collaboration
- ## How These Principles Integrate
- # mind Framework
- ## WHY THIS PROTOCOL EXISTS
- ## COMPANION: PRINCIPLES.md
- ## THE CORE INSIGHT
- ## HOW TO USE THIS
- ## FILE TYPES AND THEIR PURPOSE
- ## KEY PRINCIPLES (from PRINCIPLES.md)
- ## STRUCTURING YOUR DOCS
- ## WHEN DOCS DON'T EXIST
- ## THE DOCUMENTATION PROCESS
- ## Maturity
- ## NAMING ENGINEERING PRINCIPLES
- ## MARKERS
- ## CLI COMMANDS
- # Run scripts with local runtime
- # my_script.py - imports work normally
- ## MCP MEMBRANE TOOLS
- ## MIND UNIVERSAL SCHEMA
- ## THE PROTOCOL IS A TOOL
- ## Before Any Task
- ## After Any Change

**Sections:**
- # Mind Platform
- ## Vision
- ## Structure
- ## Features
- ## Development
- # Set backend URL (default: http://localhost:8765)
- ## Architecture Context
- ## License

**Code refs:**
- `__init__.py`
- `api/connectome/graph/route.ts`
- `api/connectome/graphs/route.ts`
- `api/connectome/search/route.ts`
- `api/sse/route.ts`
- `api/stats/route.ts`
- `app.py`
- `app/api/activity/route.ts`
- `app/api/connectome/graph/route.ts`
- `app/api/connectome/graphs/route.ts`
- `app/api/connectome/search/route.ts`
- `app/api/registry/citizens/route.ts`
- `app/api/registry/health/route.ts`
- `app/api/registry/orgs/route.ts`
- `app/api/registry/search/route.ts`
- `app/api/route.ts`
- `app/api/stats/route.ts`
- `app/connectome/components/connectome_health_panel.ts`
- `app/connectome/components/connectome_log_duration_formatting_and_threshold_color_rules.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.ts`
- `app/connectome/components/connectome_log_export_buttons_using_state_store_serializers.tsx`
- `app/connectome/components/connectome_log_trigger_and_calltype_badge_color_tokens.ts`
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.ts`
- `app/connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `app/connectome/components/deterministic_zone_and_node_layout_computation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_directional_shine_animation_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.ts`
- `app/connectome/components/edge_kit/connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `app/connectome/components/edge_kit/connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `app/connectome/components/edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `app/connectome/components/edge_kit/connectome_node_boundary_intersection_geometry_helpers.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.ts`
- `app/connectome/components/edge_kit/semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `app/connectome/components/edge_label_declutter_and_visibility_policy_helpers.ts`
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `app/connectome/components/node_kit/connectome_energy_badge_bucketed_glow_and_value_formatter.tsx`
- `app/connectome/components/node_kit/connectome_node_background_theme_tokens_by_type_and_language.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.ts`
- `app/connectome/components/node_kit/connectome_node_frame_with_title_path_and_tooltip_shell.tsx`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.ts`
- `app/connectome/components/node_kit/connectome_node_step_list_and_active_step_highlighter.tsx`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.ts`
- `app/connectome/components/node_kit/connectome_player_wait_progress_bar_with_four_second_cap.tsx`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.ts`
- `app/connectome/components/node_kit/connectome_tick_cron_circular_progress_ring_with_speed_label.tsx`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.ts`
- `app/connectome/components/node_kit/typed_connectome_node_components_with_energy_and_step_highlighting.tsx`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.ts`
- `app/connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `app/connectome/components/telemetry_camera_controls.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.ts`
- `app/connectome/components/unified_now_and_copyable_ledger_log_panel.tsx`
- `app/connectome/lib/connectome_export_jsonl_and_text_log_serializer.ts`
- `app/connectome/lib/connectome_session_boundary_and_restart_policy_controller.ts`
- `app/connectome/lib/connectome_step_script_sample_sequence.ts`
- `app/connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `app/connectome/lib/connectome_wait_timer_progress_and_tick_display_signal_selectors.ts`
- `app/connectome/lib/flow_event_duration_bucket_color_classifier.ts`
- `app/connectome/lib/flow_event_schema_and_normalization_contract.ts`
- `app/connectome/lib/flow_event_trigger_and_calltype_inference_rules.ts`
- `app/connectome/lib/minimum_duration_clamp_and_speed_based_default_policy.ts`
- `app/connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `app/connectome/lib/step_script_cursor_and_replay_determinism_helpers.ts`
- `app/connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- `app/connectome/page.tsx`
- `app/layout.ts`
- `app/layout.tsx`
- `app/mind/page.ts`
- `app/mind/page.tsx`
- `app/page.ts`
- `app/page.tsx`
- `base.py`
- `camelCase.ts`
- `claim.py`
- `connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- `connectome_edge_directional_shine_animation_helpers.ts`
- `connectome_edge_label_renderer_with_halo_and_zoom_policy.tsx`
- `connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers.ts`
- `connectome_edge_style_tokens_for_trigger_and_calltype_mapping.ts`
- `connectome_energy_badge_bucketed_glow_and_value_formatter.ts`
- `connectome_node_background_theme_tokens_by_type_and_language.ts`
- `connectome_node_boundary_intersection_geometry_helpers.ts`
- `connectome_read_cli.py`
- `connectome_system_map_node_edge_manifest.ts`
- `detection.py`
- `dispatch.py`
- `doctor_cli_parser_and_run_checker.py`
- `execution.py`
- `flow_event_schema_and_normalization_contract.ts`
- `grammar/claim.py`
- `grammar/detection.py`
- `grammar/execution.py`
- `grammar/resolution.py`
- `grammar/verification.py`
- `layout.tsx`
- `lib/api.ts`
- `lib/api/client.ts`
- `lib/constants/colors.ts`
- `lib/design/index.ts`
- `lib/design/tokens.ts`
- `lib/design/utils.ts`
- `lib/types.ts`
- `lib/utils.ts`
- `loader.py`
- `mcp/health.py`
- `mcp/server.py`
- `mind/health/activity_logger.py`
- `mind/health/connectome_health_service.py`
- `mind/infrastructure/orchestration/orchestrator.py`
- `mind/physics/tick.py`
- `page.tsx`
- `pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `path/to/file.py`
- `registry.py`
- `route.ts`
- `runtime/capability/base.py`
- `runtime/capability/dispatch.py`
- `runtime/capability/loader.py`
- `runtime/capability/registry.py`
- `runtime/checks.py`
- `runtime/grammar/claim.py`
- `runtime/grammar/detection.py`
- `runtime/grammar/execution.py`
- `runtime/grammar/resolution.py`
- `runtime/ingest/docs.py`
- `semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`
- `src/auth/login.py`
- `src/old_module.py`
- `task_query.py`
- `task_state.py`
- `tools/test_health_live.py`

**Doc refs:**
- `docs/MAPPING.md`
- `docs/TAXONOMY.md`
- `docs/connectome/edge_kit/BEHAVIORS_Connectome_Edge_Kit_Readable_Directional_And_Truthful_Link_Effects.md`
- `docs/connectome/edge_kit/HEALTH_Connectome_Edge_Kit_Runtime_Verification_Of_Link_Visibility_And_Semantic_Styling.md`
- `docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md`
- `docs/connectome/edge_kit/PATTERNS_Connectome_Edge_Kit_Color_Coded_Trigger_Typed_Directional_Link_Styling_Patterns.md`
- `docs/connectome/edge_kit/SYNC_Connectome_Edge_Kit_Sync_Current_State.md`
- `docs/connectome/edge_kit/VALIDATION_Connectome_Edge_Kit_Invariants_For_Color_Dash_And_Pulse_Truth.md`
- `docs/connectome/event_model/ALGORITHM_Connectome_Event_Normalization_And_Rendering_Event_Synthesis.md`
- `docs/connectome/flow_canvas/ALGORITHM_Connectome_Flow_Canvas_Layout_Zones_And_Edge_Label_Decluttering.md`
- `docs/connectome/flow_canvas/BEHAVIORS_Connectome_Flow_Canvas_Readable_Stable_Interaction_Effects.md`
- `docs/connectome/flow_canvas/HEALTH_Connectome_Flow_Canvas_Runtime_Verification_Of_Render_Stability_And_Perf_Budgets.md`
- `docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md`
- `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`
- `docs/connectome/flow_canvas/SYNC_Connectome_Flow_Canvas_Sync_Current_State.md`
- `docs/connectome/flow_canvas/VALIDATION_Connectome_Flow_Canvas_Invariants_For_Readability_And_Stability.md`
- `docs/connectome/graph_api/SYNC_Graph_API.md`
- `docs/connectome/graphs/OBJECTIVES_Connectome_Graphs.md`
- `docs/connectome/graphs/PATTERNS_Connectome_Graphs.md`
- `docs/connectome/graphs/SYNC_Connectome_Graphs_Sync_Current_State.md`
- `docs/connectome/log_panel/ALGORITHM_Connectome_Log_Panel_Log_Rendering_Duration_Coloring_And_Export.md`
- `docs/connectome/log_panel/BEHAVIORS_Connectome_Log_Panel_Step_Clarity_And_Copyable_Audit_Trail_Effects.md`
- `docs/connectome/log_panel/HEALTH_Connectome_Log_Panel_Runtime_Verification_Of_Log_Truth_And_Export_Integrity.md`
- `docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md`
- `docs/connectome/log_panel/PATTERNS_Connectome_Log_Panel_Unified_Explain_And_Copyable_Event_Ledger_View_Patterns.md`
- `docs/connectome/log_panel/SYNC_Connectome_Log_Panel_Sync_Current_State.md`
- `docs/connectome/log_panel/VALIDATION_Connectome_Log_Panel_Invariants_For_Truthful_Durations_And_Stable_Export.md`
- `docs/connectome/node_kit/ALGORITHM_Connectome_Node_Kit_Node_Rendering_Spec_And_Energy_Glow_Mapping.md`
- `docs/connectome/node_kit/BEHAVIORS_Connectome_Node_Kit_Visible_Clarity_And_Trust_Effects.md`
- `docs/connectome/node_kit/HEALTH_Connectome_Node_Kit_Runtime_Verification_Of_Node_State_And_Visual_Signal_Truth.md`
- `docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md`
- `docs/connectome/node_kit/PATTERNS_Connectome_Node_Kit_Typed_Language_Coded_Energy_Aware_Node_Rendering_Patterns.md`
- `docs/connectome/node_kit/SYNC_Connectome_Node_Kit_Sync_Current_State.md`
- `docs/connectome/node_kit/VALIDATION_Connectome_Node_Kit_Invariants_For_Node_Readability_And_State_Reflection.md`
- `docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md`
- `docs/connectome/runtime_mind/ALGORITHM_Connectome_Runtime_Engine_Step_Release_And_Realtime_Scheduling.md`
- `docs/connectome/runtime_mind/BEHAVIORS_Connectome_Runtime_Engine_User_Controlled_Traversal_Effects.md`
- `docs/connectome/runtime_mind/HEALTH_Connectome_Runtime_Engine_Runtime_Verification_Of_Pacing_And_Order.md`
- `docs/connectome/runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `docs/connectome/runtime_mind/PATTERNS_Connectome_Runtime_Engine_Stepper_And_Realtime_Traversal_Control_Patterns.md`
- `docs/connectome/runtime_mind/SYNC_Connectome_Runtime_Engine_Sync_Current_State.md`
- `docs/connectome/runtime_mind/VALIDATION_Connectome_Runtime_Engine_Invariants_For_Stepper_And_Realtime.md`
- `docs/connectome/state_store/ALGORITHM_Connectome_State_Store_Atomic_Commits_For_Step_Releases_And_Realtime.md`
- `docs/connectome/state_store/BEHAVIORS_Connectome_State_Store_Observable_State_Consistency_Effects.md`
- `docs/connectome/state_store/HEALTH_Connectome_State_Store_Runtime_Verification_Of_Ledger_And_Timer_Correctness.md`
- `docs/connectome/state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `docs/connectome/state_store/PATTERNS_Connectome_State_Store_Single_Source_Of_Truth_For_Events_Focus_And_Timers.md`
- `docs/connectome/state_store/SYNC_Connectome_State_Store_Sync_Current_State.md`
- `docs/connectome/state_store/VALIDATION_Connectome_State_Store_Invariants_For_Ledger_Ordering_And_Focus.md`
- `docs/frontend/app_shell/OBJECTIVES_App_Shell.md`
- `docs/frontend/app_shell/PATTERNS_App_Shell.md`
- `docs/frontend/app_shell/SYNC_App_Shell_State.md`
- `docs/landing/BEHAVIORS_Landing_UX.md`
- `docs/landing/IMPLEMENTATION_Landing_Code.md`
- `docs/mind/membrane/PATTERN_Membrane_Modulation.md`
- `docs/physics/subentity/ALGORITHM_SubEntity.md`
- `docs/physics/subentity/BEHAVIORS_SubEntity.md`
- `docs/physics/subentity/VALIDATION_SubEntity.md`
- `docs/registry/BEHAVIORS_Registry_UX.md`
- `docs/registry/IMPLEMENTATION_Registry_Code.md`
- `docs/schema/PATTERNS_Schema.md`
- `docs/ux/PATTERNS_UX_Principles.md`
- `docs/vision/PATTERNS_Platform_Vision_And_Architecture.md`
- `docs/vision/SYNC_Platform_Vision.md`
- `docs/vision/VALIDATION_Platform_Invariants.md`
- `docs/vision/VOCABULARY_Platform_Terms.md`
- `event_model/IMPLEMENTATION_Connectome_Event_Model_Code_Architecture_And_Schema.md`
- `runtime_mind/IMPLEMENTATION_Connectome_Runtime_Engine_Code_Structure_And_Control_Surface.md`
- `skills/SKILL_fix_procedure.md`
- `skills/SKILL_solve_markers.md`
- `skills/SKILL_update_sync.md`
- `state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`
- `tasks/TASK_*.md`

**Sections:**
- # Repository Map: mind-platform

**Code refs:**
- `api/connectome/graph/route.ts`
- `api/connectome/graphs/route.ts`
- `api/connectome/search/route.ts`
- `api/sse/route.ts`
- `api/stats/route.ts`
- `connectome/components/connectome_page_shell_route_layout_and_control_surface.tsx`
- `connectome/components/pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `connectome/lib/connectome_system_map_node_edge_manifest.ts`
- `connectome/lib/next_step_gate_and_realtime_playback_runtime_engine.ts`
- `connectome/lib/zustand_connectome_state_store_with_atomic_commit_actions.ts`
- `layout.tsx`

**Doc refs:**
- `docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md`
- `docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md`
- `docs/frontend/app_shell/PATTERNS_App_Shell.md`
- `docs/landing/IMPLEMENTATION_Landing_Code.md`
- `docs/registry/IMPLEMENTATION_Registry_Code.md`

**Sections:**
- # Repository Map: mind-platform/app
- ## Statistics
- ## File Tree
- ## File Details
