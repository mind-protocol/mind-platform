# Repository Map: mind-platform

*Generated: 2025-12-29 18:54*

- **Files:** 248
- **Directories:** 77
- **Total Size:** 1.6M
- **Doc Files:** 212
- **Code Files:** 33
- **Areas:** 8 (docs/ subfolders)
- **Modules:** 16 (subfolders in areas)
- **DOCS Links:** 5 (0.15 avg per code file)

- markdown: 212
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
├── docs/ (971.5K)
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
│   └── map.md (119.0K)
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
├── templates/ (285.6K)
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
│   ├── agents/ (47.9K)
│   │   ├── architect/ (4.9K)
│   │   │   ├── AGENTS.md (1.1K)
│   │   │   ├── CLAUDE.md (2.9K)
│   │   │   └── GEMINI.md (944)
│   │   ├── fixer/ (4.5K)
│   │   │   ├── AGENTS.md (997)
│   │   │   ├── CLAUDE.md (2.6K)
│   │   │   └── GEMINI.md (858)
│   │   ├── groundwork/ (4.6K)
│   │   │   ├── AGENTS.md (1.0K)
│   │   │   ├── CLAUDE.md (2.7K)
│   │   │   └── GEMINI.md (890)
│   │   ├── herald/ (4.8K)
│   │   │   ├── AGENTS.md (1.1K)
│   │   │   ├── CLAUDE.md (2.7K)
│   │   │   └── GEMINI.md (910)
│   │   ├── keeper/ (4.8K)
│   │   │   ├── AGENTS.md (1.1K)
│   │   │   ├── CLAUDE.md (2.8K)
│   │   │   └── GEMINI.md (925)
│   │   ├── scout/ (4.7K)
│   │   │   ├── AGENTS.md (1.1K)
│   │   │   ├── CLAUDE.md (2.7K)
│   │   │   └── GEMINI.md (939)
│   │   ├── steward/ (5.2K)
│   │   │   ├── AGENTS.md (1.1K)
│   │   │   ├── CLAUDE.md (3.0K)
│   │   │   └── GEMINI.md (1.1K)
│   │   ├── voice/ (4.6K)
│   │   │   ├── AGENTS.md (1.0K)
│   │   │   ├── CLAUDE.md (2.7K)
│   │   │   └── GEMINI.md (868)
│   │   ├── weaver/ (4.6K)
│   │   │   ├── AGENTS.md (1.0K)
│   │   │   ├── CLAUDE.md (2.7K)
│   │   │   └── GEMINI.md (861)
│   │   └── witness/ (5.2K)
│   │       ├── AGENTS.md (1.2K)
│   │       ├── CLAUDE.md (3.1K)
│   │       └── GEMINI.md (980)
│   ├── docs/ (51.2K)
│   │   ├── ALGORITHM_TEMPLATE.md (2.7K)
│   │   ├── BEHAVIORS_TEMPLATE.md (2.9K)
│   │   ├── HEALTH_TEMPLATE.md (14.9K)
│   │   ├── IMPLEMENTATION_TEMPLATE.md (8.8K)
│   │   ├── MAPPING_TEMPLATE.md (2.7K)
│   │   ├── PATTERNS_TEMPLATE.md (2.9K)
│   │   ├── SYNC_TEMPLATE.md (3.1K)
│   │   ├── TAXONOMY_TEMPLATE.md (1.7K)
│   │   ├── VALIDATION_TEMPLATE.md (2.0K)
│   │   ├── VOCABULARY_TEMPLATE.md (2.9K)
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
├── map.md (120.4K)
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
- `doctor_cli_parser_and_run_checker.py`
- `flow_event_schema_and_normalization_contract.ts`
- `layout.tsx`
- `lib/api.ts`
- `lib/api/client.ts`
- `lib/constants/colors.ts`
- `lib/design/index.ts`
- `lib/design/tokens.ts`
- `lib/design/utils.ts`
- `lib/types.ts`
- `mind/health/activity_logger.py`
- `mind/health/connectome_health_service.py`
- `mind/infrastructure/orchestration/orchestrator.py`
- `mind/physics/tick.py`
- `page.tsx`
- `pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `route.ts`
- `semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`
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
- `state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`

**Sections:**
- # Repository Map: mind-platform

**Definitions:**
- `alpha()`
- `getLayerColor()`
- `getNodeTypeColor()`
- `getVerificationColor()`
- `getStatusColor()`

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

**Sections:**
- # architect (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # architect
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be architect
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # architect (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # fixer (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # fixer
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be fixer
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # fixer (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # groundwork (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # groundwork
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be groundwork
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # groundwork (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # herald (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # herald
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be herald
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # herald (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # keeper (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # keeper
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be keeper
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # keeper (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # scout (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # scout
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be scout
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # scout (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # steward (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # steward
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be steward
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements
- ## Circular Complement

**Sections:**
- # steward (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff
- ## Circular Complement

**Sections:**
- # voice (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # voice
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be voice
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # voice (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # weaver (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # weaver
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be weaver
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # weaver (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

**Sections:**
- # witness (Claude Agent SDK)
- ## System Prompt
- ## Anchor Vocabulary
- ## Output Format
- ## Switching Triggers

**Sections:**
- # witness
- ## Posture
- ## How This Shapes Work
- ## Example Behavior
- ## Protocols
- ## When to Be witness
- ## When to Switch
- ## Field Signals
- ## Memory
- ## Complements

**Sections:**
- # witness (Gemini)
- ## Posture
- ## Anchor
- ## How You Work
- ## Your Blind Spot
- ## Output
- ## Handoff

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

**Code refs:**
- `{path/to/health/checker_script.py`

**Sections:**
- # {Module} — Health: Verification Mechanics and Coverage
- ## WHEN TO USE HEALTH (NOT TESTS)
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
- ## INDICATOR: {Indicator Name}
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
- `doctor_cli_parser_and_run_checker.py`
- `flow_event_schema_and_normalization_contract.ts`
- `layout.tsx`
- `lib/api.ts`
- `lib/api/client.ts`
- `lib/constants/colors.ts`
- `lib/design/index.ts`
- `lib/design/tokens.ts`
- `lib/design/utils.ts`
- `lib/types.ts`
- `mind/health/activity_logger.py`
- `mind/health/connectome_health_service.py`
- `mind/infrastructure/orchestration/orchestrator.py`
- `mind/physics/tick.py`
- `page.tsx`
- `pannable_zoomable_zoned_flow_canvas_renderer.tsx`
- `route.ts`
- `semantic_edge_components_with_directional_shine_and_pulses.tsx`
- `semantic_proximity_based_character_node_selector.py`
- `snake_case.py`
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
- `state_store/IMPLEMENTATION_Connectome_State_Store_Code_Structure_And_Zustand_Actions.md`

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
