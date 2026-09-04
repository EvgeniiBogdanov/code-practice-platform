import { TASK_EXPLANATIONS } from "../../taskExplanations";


// Импорт компонентов разминки
import WarmupCandidate1Raw from "../tasks/1_warmup/1_UseStateBasic.jsx?raw";
import WarmupCandidate1 from "../tasks/1_warmup/1_UseStateBasic.jsx";
import WarmupSolution1 from "../solutions/1_warmup/1_UseStateBasic.jsx";
import WarmupSolution1Raw from "../solutions/1_warmup/1_UseStateBasic.jsx?raw";
import WarmupCandidate2Raw from "../tasks/1_warmup/2_SearchInput.jsx?raw";
import WarmupCandidate2 from "../tasks/1_warmup/2_SearchInput.jsx";
import WarmupSolution2 from "../solutions/1_warmup/2_SearchInput.jsx";
import WarmupSolution2Raw from "../solutions/1_warmup/2_SearchInput.jsx?raw";
import WarmupCandidate3Raw from "../tasks/1_warmup/3_Subscription.jsx?raw";
import WarmupCandidate3 from "../tasks/1_warmup/3_Subscription.jsx";
import WarmupSolution3 from "../solutions/1_warmup/3_Subscription.jsx";
import WarmupSolution3Raw from "../solutions/1_warmup/3_Subscription.jsx?raw";
import WarmupCandidate4Raw from "../tasks/1_warmup/4_ConditionalRendering.jsx?raw";
import WarmupCandidate4 from "../tasks/1_warmup/4_ConditionalRendering.jsx";
import WarmupSolution4 from "../solutions/1_warmup/4_ConditionalRendering.jsx";
import WarmupSolution4Raw from "../solutions/1_warmup/4_ConditionalRendering.jsx?raw";
import WarmupCandidate5Raw from "../tasks/1_warmup/5_Counter.jsx?raw";
import WarmupCandidate5 from "../tasks/1_warmup/5_Counter.jsx";
import WarmupSolution5 from "../solutions/1_warmup/5_Counter.jsx";
import WarmupSolution5Raw from "../solutions/1_warmup/5_Counter.jsx?raw";
import WarmupCandidate6Raw from "../tasks/1_warmup/6_TripleCounter.jsx?raw";
import WarmupCandidate6 from "../tasks/1_warmup/6_TripleCounter.jsx";
import WarmupSolution6 from "../solutions/1_warmup/6_TripleCounter.jsx";
import WarmupSolution6Raw from "../solutions/1_warmup/6_TripleCounter.jsx?raw";
import WarmupCandidate7Raw from "../tasks/1_warmup/7_UserProfile.jsx?raw";
import WarmupCandidate7 from "../tasks/1_warmup/7_UserProfile.jsx";
import WarmupSolution7 from "../solutions/1_warmup/7_UserProfile.jsx";
import WarmupSolution7Raw from "../solutions/1_warmup/7_UserProfile.jsx?raw";
import WarmupCandidate8Raw from "../tasks/1_warmup/8_MultiInputForm.jsx?raw";
import WarmupCandidate8 from "../tasks/1_warmup/8_MultiInputForm.jsx";
import WarmupSolution8 from "../solutions/1_warmup/8_MultiInputForm.jsx";
import WarmupSolution8Raw from "../solutions/1_warmup/8_MultiInputForm.jsx?raw";
import WarmupCandidate9Raw from "../tasks/1_warmup/9_FormSubmit.jsx?raw";
import WarmupCandidate9 from "../tasks/1_warmup/9_FormSubmit.jsx";
import WarmupSolution9 from "../solutions/1_warmup/9_FormSubmit.jsx";
import WarmupSolution9Raw from "../solutions/1_warmup/9_FormSubmit.jsx?raw";
import WarmupCandidate10Raw from "../tasks/1_warmup/10_ListFilter.jsx?raw";
import WarmupCandidate10 from "../tasks/1_warmup/10_ListFilter.jsx";
import WarmupSolution10 from "../solutions/1_warmup/10_ListFilter.jsx";
import WarmupSolution10Raw from "../solutions/1_warmup/10_ListFilter.jsx?raw";
import WarmupCandidate11Raw from "../tasks/1_warmup/11_SelectFilter.jsx?raw";
import WarmupCandidate11 from "../tasks/1_warmup/11_SelectFilter.jsx";
import WarmupSolution11 from "../solutions/1_warmup/11_SelectFilter.jsx";
import WarmupSolution11Raw from "../solutions/1_warmup/11_SelectFilter.jsx?raw";
import WarmupCandidate12Raw from "../tasks/1_warmup/12_ListKeys.jsx?raw";
import WarmupCandidate12 from "../tasks/1_warmup/12_ListKeys.jsx";
import WarmupSolution12 from "../solutions/1_warmup/12_ListKeys.jsx";
import WarmupSolution12Raw from "../solutions/1_warmup/12_ListKeys.jsx?raw";
import WarmupCandidate13 from "../tasks/1_warmup/13_AsyncAwait.js?raw";
import WarmupSolution13 from "../solutions/1_warmup/13_AsyncAwait.js?raw";
import WarmupCandidate14 from "../tasks/1_warmup/14_AsyncAwaitFetch.js?raw";
import WarmupSolution14 from "../solutions/1_warmup/14_AsyncAwaitFetch.js?raw";
import WarmupCandidate15 from "../tasks/1_warmup/15_UseEffectBasic.js?raw";
import WarmupSolution15 from "../solutions/1_warmup/15_UseEffectBasic.js?raw";
import WarmupCandidate16 from "../tasks/1_warmup/16_UseEffectFetch.jsx";
import WarmupCandidate16Raw from "../tasks/1_warmup/16_UseEffectFetch.jsx?raw";
import WarmupSolution16 from "../solutions/1_warmup/16_UseEffectFetch.jsx";
import WarmupSolution16Raw from "../solutions/1_warmup/16_UseEffectFetch.jsx?raw";
import WarmupCandidate17 from "../tasks/1_warmup/17_UseEffectAbortController.jsx";
import WarmupCandidate17Raw from "../tasks/1_warmup/17_UseEffectAbortController.jsx?raw";
import WarmupSolution17 from "../solutions/1_warmup/17_UseEffectAbortController.jsx";
import WarmupSolution17Raw from "../solutions/1_warmup/17_UseEffectAbortController.jsx?raw";
import WarmupCandidate18 from "../tasks/1_warmup/18_UseMemoBasic.js?raw";
import WarmupSolution18 from "../solutions/1_warmup/18_UseMemoBasic.js?raw";
import WarmupCandidate19 from "../tasks/1_warmup/19_UseMemoPractice.jsx";
import WarmupCandidate19Raw from "../tasks/1_warmup/19_UseMemoPractice.jsx?raw";
import WarmupSolution19 from "../solutions/1_warmup/19_UseMemoPractice.jsx";
import WarmupSolution19Raw from "../solutions/1_warmup/19_UseMemoPractice.jsx?raw";
import WarmupCandidate20 from "../tasks/1_warmup/20_UseCallbackBasic.js?raw";
import WarmupSolution20 from "../solutions/1_warmup/20_UseCallbackBasic.js?raw";
import WarmupCandidate21 from "../tasks/1_warmup/21_UseCallbackPractice.jsx";
import WarmupCandidate21Raw from "../tasks/1_warmup/21_UseCallbackPractice.jsx?raw";
import WarmupSolution21 from "../solutions/1_warmup/21_UseCallbackPractice.jsx";
import WarmupSolution21Raw from "../solutions/1_warmup/21_UseCallbackPractice.jsx?raw";
import WarmupCandidate22 from "../tasks/1_warmup/22_UseRefBasic.js?raw";
import WarmupSolution22 from "../solutions/1_warmup/22_UseRefBasic.js?raw";
import WarmupCandidate23 from "../tasks/1_warmup/23_UseRefFocus.jsx";
import WarmupCandidate23Raw from "../tasks/1_warmup/23_UseRefFocus.jsx?raw";
import WarmupSolution23 from "../solutions/1_warmup/23_UseRefFocus.jsx";
import WarmupSolution23Raw from "../solutions/1_warmup/23_UseRefFocus.jsx?raw";
import WarmupCandidate24 from "../tasks/1_warmup/24_UseRefUncontrolledForm.jsx";
import WarmupCandidate24Raw from "../tasks/1_warmup/24_UseRefUncontrolledForm.jsx?raw";
import WarmupSolution24 from "../solutions/1_warmup/24_UseRefUncontrolledForm.jsx";
import WarmupSolution24Raw from "../solutions/1_warmup/24_UseRefUncontrolledForm.jsx?raw";
import WarmupCandidate25 from "../tasks/1_warmup/25_ArrayCrud.jsx";
import WarmupCandidate25Raw from "../tasks/1_warmup/25_ArrayCrud.jsx?raw";
import WarmupSolution25 from "../solutions/1_warmup/25_ArrayCrud.jsx";
import WarmupSolution25Raw from "../solutions/1_warmup/25_ArrayCrud.jsx?raw";
import WarmupCandidate26 from "../tasks/1_warmup/26_LiftingStateUp.jsx";
import WarmupCandidate26Raw from "../tasks/1_warmup/26_LiftingStateUp.jsx?raw";
import WarmupSolution26 from "../solutions/1_warmup/26_LiftingStateUp.jsx";
import WarmupSolution26Raw from "../solutions/1_warmup/26_LiftingStateUp.jsx?raw";
import WarmupCandidate27 from "../tasks/1_warmup/27_UseEffectTimer.jsx";
import WarmupCandidate27Raw from "../tasks/1_warmup/27_UseEffectTimer.jsx?raw";
import WarmupSolution27 from "../solutions/1_warmup/27_UseEffectTimer.jsx";
import WarmupSolution27Raw from "../solutions/1_warmup/27_UseEffectTimer.jsx?raw";
import WarmupCandidate28 from "../tasks/1_warmup/28_UseEffectEventListener.jsx";
import WarmupCandidate28Raw from "../tasks/1_warmup/28_UseEffectEventListener.jsx?raw";
import WarmupSolution28 from "../solutions/1_warmup/28_UseEffectEventListener.jsx";
import WarmupSolution28Raw from "../solutions/1_warmup/28_UseEffectEventListener.jsx?raw";
import WarmupCandidate29 from "../tasks/1_warmup/29_UseRefValue.jsx";
import WarmupCandidate29Raw from "../tasks/1_warmup/29_UseRefValue.jsx?raw";
import WarmupSolution29 from "../solutions/1_warmup/29_UseRefValue.jsx";
import WarmupSolution29Raw from "../solutions/1_warmup/29_UseRefValue.jsx?raw";
import WarmupCandidate30 from "../tasks/1_warmup/30_DerivedState.jsx";
import WarmupCandidate30Raw from "../tasks/1_warmup/30_DerivedState.jsx?raw";
import WarmupSolution30 from "../solutions/1_warmup/30_DerivedState.jsx";
import WarmupSolution30Raw from "../solutions/1_warmup/30_DerivedState.jsx?raw";
import WarmupCandidate31 from "../tasks/1_warmup/31_CustomHookUseToggle.jsx";
import WarmupCandidate31Raw from "../tasks/1_warmup/31_CustomHookUseToggle.jsx?raw";
import WarmupSolution31 from "../solutions/1_warmup/31_CustomHookUseToggle.jsx";
import WarmupSolution31Raw from "../solutions/1_warmup/31_CustomHookUseToggle.jsx?raw";

// Импорт компонентов Рефакторинга
import RefactoringCandidate1 from "../tasks/2_refactoring/1_StateMutation.js?raw";
import RefactoringSolution1 from "../solutions/2_refactoring/1_StateMutation.js?raw";
import RefactoringCandidate2 from "../tasks/2_refactoring/2_EffectSynchronizer.js?raw";
import RefactoringSolution2 from "../solutions/2_refactoring/2_EffectSynchronizer.js?raw";
import RefactoringCandidate3 from "../tasks/2_refactoring/3_ExpensiveCalculation.js?raw";
import RefactoringSolution3 from "../solutions/2_refactoring/3_ExpensiveCalculation.js?raw";
import RefactoringCandidate4 from "../tasks/2_refactoring/4_ChildReRenders.js?raw";
import RefactoringSolution4 from "../solutions/2_refactoring/4_ChildReRenders.js?raw";
import RefactoringCandidate5 from "../tasks/2_refactoring/5_PrematureOptimization.js?raw";
import RefactoringSolution5 from "../solutions/2_refactoring/5_PrematureOptimization.js?raw";
import RefactoringCandidate6 from "../tasks/2_refactoring/6_RaceCondition.js?raw";
import RefactoringSolution6 from "../solutions/2_refactoring/6_RaceCondition.js?raw";
import RefactoringCandidate7 from "../tasks/2_refactoring/7_DebounceSearch.js?raw";
import RefactoringSolution7 from "../solutions/2_refactoring/7_DebounceSearch.js?raw";
import RefactoringCandidate8 from "../tasks/2_refactoring/8_MemoryLeakScroll.js?raw";
import RefactoringSolution8 from "../solutions/2_refactoring/8_MemoryLeakScroll.js?raw";
import RefactoringCandidate9 from "../tasks/2_refactoring/9_VanillaDOM.js?raw";
import RefactoringSolution9 from "../solutions/2_refactoring/9_VanillaDOM.js?raw";
import RefactoringCandidate10 from "../tasks/2_refactoring/10_TechnicalDataState.js?raw";
import RefactoringSolution10 from "../solutions/2_refactoring/10_TechnicalDataState.js?raw";
import RefactoringCandidate11 from "../tasks/2_refactoring/11_ForwardRef.js?raw";
import RefactoringSolution11 from "../solutions/2_refactoring/11_ForwardRef.js?raw";
import RefactoringCandidate12 from "../tasks/2_refactoring/12_ReactPortals.js?raw";
import RefactoringSolution12 from "../solutions/2_refactoring/12_ReactPortals.js?raw";
import RefactoringCandidate13 from "../tasks/2_refactoring/13_ReactRouterLinks.js?raw";
import RefactoringSolution13 from "../solutions/2_refactoring/13_ReactRouterLinks.js?raw";
import RefactoringCandidate14 from "../tasks/2_refactoring/14_ProgrammaticNavigation.js?raw";
import RefactoringSolution14 from "../solutions/2_refactoring/14_ProgrammaticNavigation.js?raw";
import RefactoringCandidate15Comp from "../tasks/2_refactoring/15_CompanyXRefactoring.tsx";
import RefactoringCandidate15 from "../tasks/2_refactoring/15_CompanyXRefactoring.tsx?raw";
import RefactoringSolution15Comp from "../solutions/2_refactoring/15_CompanyXRefactoring.tsx";
import RefactoringSolution15 from "../solutions/2_refactoring/15_CompanyXRefactoring.tsx?raw";
import RefactoringCandidate16 from "../tasks/2_refactoring/16_TimerRefactoring/App.jsx";
import RefactoringCandidate16Raw from "../tasks/2_refactoring/16_TimerRefactoring/App.jsx?raw";
import RefactoringCandidate16_App from "../tasks/2_refactoring/16_TimerRefactoring/App.jsx?raw";
import RefactoringCandidate16_Css from "../tasks/2_refactoring/16_TimerRefactoring/App.css?raw";
import RefactoringSolution16 from "../solutions/2_refactoring/16_TimerRefactoring/App.jsx";
import RefactoringSolution16Raw from "../solutions/2_refactoring/16_TimerRefactoring/App.jsx?raw";
import RefactoringSolution16_App from "../solutions/2_refactoring/16_TimerRefactoring/App.jsx?raw";
import RefactoringSolution16_Css from "../solutions/2_refactoring/16_TimerRefactoring/App.css?raw";
import RefactoringCandidate17 from "../tasks/2_refactoring/17_RandomNumberGenerator/App.jsx";
import RefactoringCandidate17_App from "../tasks/2_refactoring/17_RandomNumberGenerator/App.jsx?raw";
import RefactoringCandidate17_Buttons from "../tasks/2_refactoring/17_RandomNumberGenerator/Buttons.jsx?raw";
import RefactoringCandidate17_List from "../tasks/2_refactoring/17_RandomNumberGenerator/List.jsx?raw";
import RefactoringSolution17 from "../solutions/2_refactoring/17_RandomNumberGenerator/App.jsx";
import RefactoringSolution17_App from "../solutions/2_refactoring/17_RandomNumberGenerator/App.jsx?raw";
import RefactoringSolution17_Buttons from "../solutions/2_refactoring/17_RandomNumberGenerator/Buttons.jsx?raw";
import RefactoringSolution17_List from "../solutions/2_refactoring/17_RandomNumberGenerator/List.jsx?raw";

// Импорт компонентов кандидатов
import Candidate1 from "../tasks/3_ui_patterns/1_FetchPersons.jsx";
import Candidate2 from "../tasks/3_ui_patterns/2_FetchPersonsDebounce.jsx";
import Candidate3 from "../tasks/3_ui_patterns/3_FetchPersonsCache.jsx";
import Candidate4 from "../tasks/3_ui_patterns/4_ArrayNoMutation.jsx";
import Candidate5 from "../tasks/3_ui_patterns/5_TodoList.jsx";
import Candidate6 from "../tasks/3_ui_patterns/6_TodoListCompanyX.jsx";
import Candidate7 from "../tasks/3_ui_patterns/7_RefetchImage.jsx";
import Candidate8 from "../tasks/3_ui_patterns/8_PostsManager.jsx";
import Candidate9 from "../tasks/3_ui_patterns/9_PasswordCompanyX.jsx";
import Candidate10 from "../tasks/3_ui_patterns/10_UrlSearchParamsFilter.jsx";
import Candidate11 from "../tasks/3_ui_patterns/11_AutocompleteCombobox.jsx";
import Candidate12 from "../tasks/3_ui_patterns/12_OptimisticLike.jsx";
import Candidate13 from "../tasks/3_ui_patterns/13_ShoppingCart.jsx";
import Candidate14 from "../tasks/3_ui_patterns/14_CompoundAccordion.jsx";
import Candidate15 from "../tasks/3_ui_patterns/15_StopwatchLaps.jsx";
import CandidateAdvanced1 from "../tasks/4_state_management/1_FetchUsersReducer/index.jsx";
import CandidateAdvanced2 from "../tasks/4_state_management/2_FetchUsersRTK/index.jsx";
import CandidateAdvanced3 from "../tasks/4_state_management/3_FetchUsersRTKSelectors/index.jsx";
import Candidate1Raw from "../tasks/3_ui_patterns/1_FetchPersons.jsx?raw";
import Candidate2Raw from "../tasks/3_ui_patterns/2_FetchPersonsDebounce.jsx?raw";
import Candidate3Raw from "../tasks/3_ui_patterns/3_FetchPersonsCache.jsx?raw";
import Candidate4Raw from "../tasks/3_ui_patterns/4_ArrayNoMutation.jsx?raw";
import Candidate5Raw from "../tasks/3_ui_patterns/5_TodoList.jsx?raw";
import Candidate6Raw from "../tasks/3_ui_patterns/6_TodoListCompanyX.jsx?raw";
import Candidate7Raw from "../tasks/3_ui_patterns/7_RefetchImage.jsx?raw";
import Candidate8Raw from "../tasks/3_ui_patterns/8_PostsManager.jsx?raw";
import Candidate9Raw from "../tasks/3_ui_patterns/9_PasswordCompanyX.jsx?raw";
import Candidate10Raw from "../tasks/3_ui_patterns/10_UrlSearchParamsFilter.jsx?raw";
import Candidate11Raw from "../tasks/3_ui_patterns/11_AutocompleteCombobox.jsx?raw";
import Candidate12Raw from "../tasks/3_ui_patterns/12_OptimisticLike.jsx?raw";
import Candidate13Raw from "../tasks/3_ui_patterns/13_ShoppingCart.jsx?raw";
import Candidate14Raw from "../tasks/3_ui_patterns/14_CompoundAccordion.jsx?raw";
import Candidate15Raw from "../tasks/3_ui_patterns/15_StopwatchLaps.jsx?raw";
import CandidateAdvanced1Raw from "../tasks/4_state_management/1_FetchUsersReducer/index.jsx?raw";
import CandidateAdvanced2Raw from "../tasks/4_state_management/2_FetchUsersRTK/index.jsx?raw";
import CandidateAdvanced3Raw from "../tasks/4_state_management/3_FetchUsersRTKSelectors/index.jsx?raw";

import CandidateAdvanced1_Index from "../tasks/4_state_management/1_FetchUsersReducer/index.jsx?raw";
import CandidateAdvanced1_Hook from "../tasks/4_state_management/1_FetchUsersReducer/useFetchUsers.js?raw";
import CandidateAdvanced1_Reducer from "../tasks/4_state_management/1_FetchUsersReducer/reducer.js?raw";

import CandidateAdvanced2_Index from "../tasks/4_state_management/2_FetchUsersRTK/index.jsx?raw";
import CandidateAdvanced2_Slice from "../tasks/4_state_management/2_FetchUsersRTK/usersSlice.js?raw";
import CandidateAdvanced2_Store from "../tasks/4_state_management/2_FetchUsersRTK/store.js?raw";

import CandidateAdvanced3_Index from "../tasks/4_state_management/3_FetchUsersRTKSelectors/index.jsx?raw";
import CandidateAdvanced3_Slice from "../tasks/4_state_management/3_FetchUsersRTKSelectors/usersSlice.js?raw";
import CandidateAdvanced3_Store from "../tasks/4_state_management/3_FetchUsersRTKSelectors/store.js?raw";
import CandidateAdvanced4 from "../tasks/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx";
import CandidateAdvanced4Raw from "../tasks/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx?raw";
import SolutionAdvanced4 from "../solutions/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx";
import SolutionAdvanced4Raw from "../solutions/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx?raw";

import CandidateAdvanced5 from "../tasks/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx";
import CandidateAdvanced5Raw from "../tasks/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx?raw";
import SolutionAdvanced5 from "../solutions/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx";
import SolutionAdvanced5Raw from "../solutions/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx?raw";

// Импорт эталонных решений
import Solution1 from "../solutions/3_ui_patterns/1_FetchPersons.jsx";
import Solution1Raw from "../solutions/3_ui_patterns/1_FetchPersons.jsx?raw";
import Solution2 from "../solutions/3_ui_patterns/2_FetchPersonsDebounce.jsx";
import Solution2Raw from "../solutions/3_ui_patterns/2_FetchPersonsDebounce.jsx?raw";
import Solution3 from "../solutions/3_ui_patterns/3_FetchPersonsCache.jsx";
import Solution3Raw from "../solutions/3_ui_patterns/3_FetchPersonsCache.jsx?raw";
import Solution4 from "../solutions/3_ui_patterns/4_ArrayNoMutation.jsx";
import Solution4Raw from "../solutions/3_ui_patterns/4_ArrayNoMutation.jsx?raw";
import Solution5 from "../solutions/3_ui_patterns/5_TodoList.jsx";
import Solution5Raw from "../solutions/3_ui_patterns/5_TodoList.jsx?raw";
import Solution6 from "../solutions/3_ui_patterns/6_TodoListCompanyX.jsx";
import Solution6Raw from "../solutions/3_ui_patterns/6_TodoListCompanyX.jsx?raw";
import Solution7 from "../solutions/3_ui_patterns/7_RefetchImage.jsx";
import Solution7Raw from "../solutions/3_ui_patterns/7_RefetchImage.jsx?raw";
import Solution8 from "../solutions/3_ui_patterns/8_PostsManager.jsx";
import Solution8Raw from "../solutions/3_ui_patterns/8_PostsManager.jsx?raw";
import Solution9 from "../solutions/3_ui_patterns/9_PasswordCompanyX.jsx";
import Solution9Raw from "../solutions/3_ui_patterns/9_PasswordCompanyX.jsx?raw";
import Solution10 from "../solutions/3_ui_patterns/10_UrlSearchParamsFilter.jsx";
import Solution10Raw from "../solutions/3_ui_patterns/10_UrlSearchParamsFilter.jsx?raw";
import Solution11 from "../solutions/3_ui_patterns/11_AutocompleteCombobox.jsx";
import Solution11Raw from "../solutions/3_ui_patterns/11_AutocompleteCombobox.jsx?raw";
import Solution12 from "../solutions/3_ui_patterns/12_OptimisticLike.jsx";
import Solution12Raw from "../solutions/3_ui_patterns/12_OptimisticLike.jsx?raw";
import Solution13 from "../solutions/3_ui_patterns/13_ShoppingCart.jsx";
import Solution13Raw from "../solutions/3_ui_patterns/13_ShoppingCart.jsx?raw";
import Solution14 from "../solutions/3_ui_patterns/14_CompoundAccordion.jsx";
import Solution14Raw from "../solutions/3_ui_patterns/14_CompoundAccordion.jsx?raw";
import Solution15 from "../solutions/3_ui_patterns/15_StopwatchLaps.jsx";
import Solution15Raw from "../solutions/3_ui_patterns/15_StopwatchLaps.jsx?raw";
import SolutionAdvanced1 from "../solutions/4_state_management/1_FetchUsersReducer/index.jsx";
import SolutionAdvanced2 from "../solutions/4_state_management/2_FetchUsersRTK/index.jsx";
import SolutionAdvanced3 from "../solutions/4_state_management/3_FetchUsersRTKSelectors/index.jsx";

import SolutionAdvanced1_Index from "../solutions/4_state_management/1_FetchUsersReducer/index.jsx?raw";
import SolutionAdvanced1_Hook from "../solutions/4_state_management/1_FetchUsersReducer/useFetchUsers.js?raw";
import SolutionAdvanced1_Reducer from "../solutions/4_state_management/1_FetchUsersReducer/reducer.js?raw";

import SolutionAdvanced2_Index from "../solutions/4_state_management/2_FetchUsersRTK/index.jsx?raw";
import SolutionAdvanced2_Slice from "../solutions/4_state_management/2_FetchUsersRTK/usersSlice.js?raw";
import SolutionAdvanced2_Store from "../solutions/4_state_management/2_FetchUsersRTK/store.js?raw";

import SolutionAdvanced3_Index from "../solutions/4_state_management/3_FetchUsersRTKSelectors/index.jsx?raw";
import SolutionAdvanced3_Slice from "../solutions/4_state_management/3_FetchUsersRTKSelectors/usersSlice.js?raw";
import SolutionAdvanced3_Store from "../solutions/4_state_management/3_FetchUsersRTKSelectors/store.js?raw";

// Импорт компонентов TypeScript: Паттерны типизации
import ReactTsCandidate1 from "../tasks/6_typescript_patterns/1_GenericList.tsx?raw";
import ReactTsSolution1 from "../solutions/6_typescript_patterns/1_GenericList.tsx?raw";
import ReactTsCandidate2 from "../tasks/6_typescript_patterns/2_PolymorphicButton.tsx?raw";
import ReactTsSolution2 from "../solutions/6_typescript_patterns/2_PolymorphicButton.tsx?raw";
import ReactTsCandidate3 from "../tasks/6_typescript_patterns/3_TypedEvents.tsx?raw";
import ReactTsSolution3 from "../solutions/6_typescript_patterns/3_TypedEvents.tsx?raw";
import ReactTsCandidate4 from "../tasks/6_typescript_patterns/4_DiscriminatedUnions.tsx?raw";
import ReactTsSolution4 from "../solutions/6_typescript_patterns/4_DiscriminatedUnions.tsx?raw";
import ReactTsCandidate5 from "../tasks/6_typescript_patterns/5_UtilityTypesReact.tsx?raw";
import ReactTsSolution5 from "../solutions/6_typescript_patterns/5_UtilityTypesReact.tsx?raw";
import ReactTsCandidate6 from "../tasks/6_typescript_patterns/6_TypedCustomHook.tsx?raw";
import ReactTsSolution6 from "../solutions/6_typescript_patterns/6_TypedCustomHook.tsx?raw";
import ReactTsCandidate7 from "../tasks/6_typescript_patterns/7_TypedContext.tsx?raw";
import ReactTsSolution7 from "../solutions/6_typescript_patterns/7_TypedContext.tsx?raw";
import ReactTsCandidate8 from "../tasks/6_typescript_patterns/8_TypedChildrenProps.tsx?raw";
import ReactTsSolution8 from "../solutions/6_typescript_patterns/8_TypedChildrenProps.tsx?raw";
import ReactTsCandidate9 from "../tasks/6_typescript_patterns/9_TypedUseReducer.tsx?raw";
import ReactTsSolution9 from "../solutions/6_typescript_patterns/9_TypedUseReducer.tsx?raw";
import ReactTsCandidate10 from "../tasks/6_typescript_patterns/10_MutuallyExclusiveProps.tsx?raw";
import ReactTsSolution10 from "../solutions/6_typescript_patterns/10_MutuallyExclusiveProps.tsx?raw";
import ReactTsCandidate11 from "../tasks/6_typescript_patterns/11_TypedForwardRef.tsx?raw";
import ReactTsSolution11 from "../solutions/6_typescript_patterns/11_TypedForwardRef.tsx?raw";
import ReactTsCandidate12 from "../tasks/6_typescript_patterns/12_MutableVsImmutableRef.tsx?raw";
import ReactTsSolution12 from "../solutions/6_typescript_patterns/12_MutableVsImmutableRef.tsx?raw";

// Импорт компонентов TypeScript: Прикладные сценарии
import ReactTsPracticeCandidate1 from "../tasks/7_typescript_components/1_UseEffectFetch.tsx";
import ReactTsPracticeSolution1 from "../solutions/7_typescript_components/1_UseEffectFetch.tsx";
import ReactTsPracticeCandidate1Raw from "../tasks/7_typescript_components/1_UseEffectFetch.tsx?raw";
import ReactTsPracticeSolution1Raw from "../solutions/7_typescript_components/1_UseEffectFetch.tsx?raw";
import ReactTsPracticeCandidate2 from "../tasks/7_typescript_components/2_RefetchImage.tsx";
import ReactTsPracticeSolution2 from "../solutions/7_typescript_components/2_RefetchImage.tsx";
import ReactTsPracticeCandidate2Raw from "../tasks/7_typescript_components/2_RefetchImage.tsx?raw";
import ReactTsPracticeSolution2Raw from "../solutions/7_typescript_components/2_RefetchImage.tsx?raw";
import ReactTsPracticeCandidate3 from "../tasks/7_typescript_components/3_PostsManager.tsx";
import ReactTsPracticeSolution3 from "../solutions/7_typescript_components/3_PostsManager.tsx";
import ReactTsPracticeCandidate3Raw from "../tasks/7_typescript_components/3_PostsManager.tsx?raw";
import ReactTsPracticeSolution3Raw from "../solutions/7_typescript_components/3_PostsManager.tsx?raw";


export const WARMUP_TASKS = [
  {
      id: "w1",
      title: "1. Синтаксис useState",
      desc: 'Объявите состояние "text" в компоненте и отобразите его.',
      candidate: WarmupCandidate1,
      rawCandidate: WarmupCandidate1Raw,
      solution: WarmupSolution1,
      rawSolution: WarmupSolution1Raw,
      filepath: "src/react/tasks/1_warmup/1_UseStateBasic.jsx",
      articles: [
        {
          title: "Хук useState (React.dev)",
          urlTitle: "Документация useState (React.dev)",
          url: "https://react.dev/reference/react/useState",
        },
        {
          title: "useState в Doka",
          urlTitle: "Хук useState (Doka.guide)",
          url: "https://doka.guide/js/react-use-state/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Почему useState возвращает массив [state, setState], а не объект?",
          answer:
            'Массив позволяет свободно переименовывать переменные при деструктуризации (const [text, setText] = useState("")), тогда как объект потребовал бы задания громоздких псевдонимов.',
        },
      ],
      checklist: [
        "Использована деструктуризация массива [state, setState]",
        'Начальное значение передано аргументом в useState("")',
        "Переменная состояния отображается в JSX через фигурные скобки {text}",
        'Не используется прямая мутация переменной (text = "new") вместо setState',
      ],
    },
  {
      id: "w5",
      title: "2. Счетчик",
      desc: "Реализуйте кнопки инкремента и декремента. Счетчик не должен опускаться ниже 0.",
      candidate: WarmupCandidate5,
      rawCandidate: WarmupCandidate5Raw,
      solution: WarmupSolution5,
      rawSolution: WarmupSolution5Raw,
      filepath: "src/react/tasks/1_warmup/5_Counter.jsx",
      articles: [
        {
          title: "Память компонента",
          urlTitle: "Состояние компонента (React.dev)",
          url: "https://react.dev/learn/state-a-components-memory",
        },
        {
          title: "Функциональный useState",
          urlTitle: "Функциональное обновление (Doka.guide)",
          url: "https://doka.guide/js/react-use-state/#funkcionalnoe-obnovlenie",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Почему прямая мутация состояния (state.count = count + 1) не работает в React?",
          answer:
            "React не отслеживает мутации свойства объектов. Чтобы запустить перерисовку виртуального DOM и сверку (reconciliation), нужно вызвать специальную функцию сеттера setState.",
        },
      ],
      checklist: [
        "Состояние счетчика хранится в useState(0) как number",
        "Декремент защищён от отрицательных значений: Math.max(0, count - 1) или проверка if",
        "Кнопки инкремента и декремента используют onClick обработчики",
        "Не используется прямая мутация count++ вместо setCount",
      ],
    },
  {
      id: "w6",
      title: "3. Исправление асинхронных обновлений",
      desc: "Реализуйте счетчик, который увеличивает значение сразу на 3 при клике на кнопку, используя функциональную форму обновления для обхода батчинга.",
      candidate: WarmupCandidate6,
      rawCandidate: WarmupCandidate6Raw,
      solution: WarmupSolution6,
      rawSolution: WarmupSolution6Raw,
      filepath: "src/react/tasks/1_warmup/6_TripleCounter.jsx",
      articles: [
        {
          title: "Очередь обновлений",
          urlTitle: "Очередность обновлений состояния (React.dev)",
          url: "https://react.dev/learn/queueing-a-series-of-state-updates",
        },
        {
          title: "Батчинг обновлений",
          urlTitle: "Функциональная форма setState (Doka.guide)",
          url: "https://doka.guide/js/react-use-state/#funkcionalnoe-obnovlenie",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Что такое автоматический батчинг (batching) обновлений в React 18?",
          answer:
            "Это группировка нескольких вызовов setState в один рендер для производительности. Если передавать значение напрямую (c + 1), 3 вызова используют зафиксированное старое состояние c. Функциональная форма (prev => prev + 1) всегда берет актуальный промежуточный стейт.",
        },
      ],
      checklist: [
        "Используется функциональная форма обновления: setState(prev => prev + 1)",
        "Понимание автоматического батчинга React 18: несколько setState объединяются в один рендер",
        "При трёх последовательных вызовах setState(prev => prev + 1) счётчик увеличивается на 3",
        "Не используется прямое значение setState(count + 1) в нескольких вызовах подряд",
      ],
    },
  {
      id: "w4",
      title: "4. Подвох условного рендеринга",
      desc: "Исправьте условный рендеринг так, чтобы при unreadCount = 0 на экране ничего не отображалось вместо цифры 0.",
      candidate: WarmupCandidate4,
      rawCandidate: WarmupCandidate4Raw,
      solution: WarmupSolution4,
      rawSolution: WarmupSolution4Raw,
      filepath: "src/react/tasks/1_warmup/4_ConditionalRendering.jsx",
      articles: [
        {
          title: "Условный рендеринг",
          urlTitle: "Условный рендеринг (React.dev)",
          url: "https://react.dev/learn/conditional-rendering",
        },
        {
          title: "Логический оператор &&",
          urlTitle: "Подвох с 0 && (Doka.guide)",
          url: "https://doka.guide/js/react-conditional-rendering/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Почему запись {items.length && <List />} выводит 0 на экран при пустом массиве?",
          answer:
            "В JS 0 && Expression возвращает 0. Число 0 в JSX считается валидным узлом и рендерится в DOM. Нужно явно использовать items.length > 0.",
        },
      ],
      checklist: [
        "При unreadCount = 0 компонент ничего не отображает в DOM",
        "Используется явное сравнение unreadCount > 0 или Boolean(unreadCount)",
        "Отсутствует вывод случайной цифры 0 при пустом массиве",
      ],
    },
  {
      id: "w2",
      title: "5. Инпут для поиска",
      desc: "Напишите компонент управляемого инпута для поиска, который отображает введенный текст и кнопку для очистки поля.",
      candidate: WarmupCandidate2,
      rawCandidate: WarmupCandidate2Raw,
      solution: WarmupSolution2,
      rawSolution: WarmupSolution2Raw,
      filepath: "src/react/tasks/1_warmup/2_SearchInput.jsx",
      articles: [
        {
          title: "Управляемые элементы",
          urlTitle: "Инпуты и формы (React.dev)",
          url: "https://react.dev/reference/react-dom/components/input",
        },
        {
          title: "Формы в React",
          urlTitle: "Формы в React (Doka.guide)",
          url: "https://doka.guide/js/react-forms/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "В чем разница между управляемым (controlled) и неконтролируемым (uncontrolled) инпутом?",
          answer:
            "В управляемом инпуте значение полностью контролирует состояние React (value + onChange). В неконтролируемом значение хранит сам DOM-узел, а React лишь считывает его через ref.",
        },
      ],
      checklist: [
        "Инпут является управляемым (controlled): value={state} + onChange={handler}",
        "Обработчик onChange принимает объект события (e) и читает e.target.value",
        'Кнопка Очистить сбрасывает состояние в пустую строку через setState("")',
        'Текст "Вы ищете: ..." динамически отображает текущее значение состояния',
      ],
    },
  {
      id: "w3",
      title: "6. Чекбокс",
      desc: "Напишите компонент чекбокса для подписки на рассылку, который динамически меняет текстовый статус в зависимости от того, выбран флажок или нет.",
      candidate: WarmupCandidate3,
      rawCandidate: WarmupCandidate3Raw,
      solution: WarmupSolution3,
      rawSolution: WarmupSolution3Raw,
      filepath: "src/react/tasks/1_warmup/3_Subscription.jsx",
      articles: [
        {
          title: "Элемент input: checkbox (React.dev)",
          urlTitle: "Документация input checkbox (React.dev)",
          url: "https://react.dev/reference/react-dom/components/input#checkbox",
        },
        {
          title: "Формы в React (Doka.guide)",
          urlTitle: "Управляемый чекбокс (Doka.guide)",
          url: "https://doka.guide/js/react-forms/#chekbox",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "В чем разница между атрибутами value и checked у тега input в React?",
          answer:
            "Для текстовых полей используется value (строка) и e.target.value. Для чекбоксов и радио-кнопок управляемым свойством является checked (булево значение true/false), а обработчик onChange считывает e.target.checked.",
        },
      ],
      checklist: [
        "Состояние чекбокса хранится в useState(false) как boolean",
        "Чекбокс является управляемым: checked={state} + onChange",
        "Текст статуса динамически меняется через тернарный оператор: state ? 'Да' : 'Нет'",
        "Не используется DOM API (document.getElementById) для чтения значения чекбокса",
      ],
    },
  {
      id: "w8",
      title: "7. Единый обработчик нескольких полей формы",
      desc: "Напишите компонент формы с тремя полями ввода, управляемыми единым объектом состояния и универсальным обработчиком по e.target.name.",
      candidate: WarmupCandidate8,
      rawCandidate: WarmupCandidate8Raw,
      solution: WarmupSolution8,
      rawSolution: WarmupSolution8Raw,
      filepath: "src/react/tasks/1_warmup/8_MultiInputForm.jsx",
      articles: [
        {
          title: "Работа с несколькими инпутами",
          urlTitle: "Обработка нескольких инпутов в React (Doka.guide)",
          url: "https://doka.guide/js/react-forms/#obrabotka-neskolkih-poley",
        },
      ],
      interviewerQuestions: [
        {
          question: "Как избавить форму с 5 инпутами от создания 5 отдельных функций-обработчиков?",
          answer:
            "Использовать единый объект состояния и универсальный обработчик e.target.name: setForm(prev => ({ ...prev, [e.target.name]: e.target.value })).",
        },
      ],
      checklist: [
        "Данные формы хранятся в едином объекте состояния form",
        "Каждый инпут имеет совпадающий атрибут name",
        "Обработчик использует вычислимое свойство [name]: value",
      ],
    },
  {
      id: "w9",
      title: "8. Отмена сабмита формы (preventDefault)",
      desc: "Исправьте форму поиска так, чтобы при сабмите или нажатии Enter не происходила перезагрузка страницы браузера.",
      candidate: WarmupCandidate9,
      rawCandidate: WarmupCandidate9Raw,
      solution: WarmupSolution9,
      rawSolution: WarmupSolution9Raw,
      filepath: "src/react/tasks/1_warmup/9_FormSubmit.jsx",
      articles: [
        {
          title: "События форм",
          urlTitle: "События onSubmit и e.preventDefault (React.dev)",
          url: "https://react.dev/reference/react-dom/components/form",
        },
      ],
      interviewerQuestions: [
        {
          question: "Зачем вызывать e.preventDefault() в обработчике onSubmit?",
          answer:
            "По умолчанию сабмит формы вызывает отправку HTTP-запроса браузером и перезагрузку всей страницы. e.preventDefault() отменяет это поведение в SPA.",
        },
      ],
      checklist: [
        "Форма обернута в тег <form onSubmit={handleSubmit}>",
        "В handleSubmit первой строкой вызывается e.preventDefault()",
        "После сабмита поле ввода очищается",
      ],
    },
  {
      id: "w7",
      title: "9. Безопасное обновление объекта",
      desc: "Напишите компонент профиля пользователя, который обновляет только возраст, сохраняя остальные данные объекта через spread-оператор.",
      candidate: WarmupCandidate7,
      rawCandidate: WarmupCandidate7Raw,
      solution: WarmupSolution7,
      rawSolution: WarmupSolution7Raw,
      filepath: "src/react/tasks/1_warmup/7_UserProfile.jsx",
      articles: [
        {
          title: "Обновление объектов в стейте",
          urlTitle: "Объекты в состоянии (React.dev)",
          url: "https://react.dev/learn/updating-objects-in-state",
        },
        {
          title: "Копирование объектов",
          urlTitle: "Клонирование и объединение объектов (LearnJS)",
          url: "https://learn.javascript.ru/object-copy",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Зачем делать поверхностную копию объекта с помощью spread-оператора { ...user, age: 25 }?",
          answer:
            "Это гарантирует создание нового объекта с новым адресом в памяти. React сравнивает предыдущее и новое состояние по ссылке (Object.is) и только при несовпадении запускает рендер.",
        },
      ],
      checklist: [
        "Объект обновляется через spread-оператор: setState({ ...prev, age: 25 })",
        "Не используется прямая мутация user.age = 25 без создания нового объекта",
        "Понимание ссылочного сравнения (Object.is) при обновлении стейта",
        "Остальные поля объекта сохраняются при частичном обновлении через spread",
      ],
    },
  {
      id: "w12",
      title: "10. Генерация стабильных ключей для данных без ID",
      desc: "Организуйте корректное управление ключами (key) для списка товаров без уникальных id, чтобы избежать сбоев при удалении элементов.",
      candidate: WarmupCandidate12,
      rawCandidate: WarmupCandidate12Raw,
      solution: WarmupSolution12,
      rawSolution: WarmupSolution12Raw,
      filepath: "src/react/tasks/1_warmup/12_ListKeys.jsx",
      articles: [
        {
          title: "Ключи в списках",
          urlTitle: "Рендеринг списков и ключи (React.dev)",
          url: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
        },
      ],
      interviewerQuestions: [
        {
          question: "Что произойдет, если писать key={crypto.randomUUID()} прямо внутри .map() в JSX?",
          answer:
            "На каждом рендере будет создаваться новый ID. React решит, что все узлы абсолютно новые, полностью уничтожит старый DOM и создаст новый. Элементы будут терять фокус, анимации и сильно тормозить.",
        },
        {
          question: "Как правильно обрабатывать списки с сервера, у которых нет уникального id?",
          answer:
            "Обогащать серверные объекты стабильным id при получении/сохранении в стейт (например,через crypto.randomUUID() один раз в useState(() => raw.map(...))) и использовать этот id в key.",
        },
      ],
      checklist: [
        "Сгенерированы стабильные id при инициализации состояния через crypto.randomUUID()",
        "Не используется key={index}",
        "Не вызывается crypto.randomUUID() или Math.random() прямо внутри .map() в JSX",
        "Реализовано корректное удаление товара по его id",
      ],
    },
  {
      id: "w10",
      title: "11. Фильтрация списка",
      desc: "Реализуйте регистронезависимый поиск по списку имен пользователей.",
      candidate: WarmupCandidate10,
      rawCandidate: WarmupCandidate10Raw,
      solution: WarmupSolution10,
      rawSolution: WarmupSolution10Raw,
      filepath: "src/react/tasks/1_warmup/10_ListFilter.jsx",
      articles: [
        {
          title: "Методы массивов",
          urlTitle: "Методы filter и includes в JS (LearnJS)",
          url: "https://learn.javascript.ru/array-methods",
        },
        {
          title: "Поиск без учета регистра",
          urlTitle: "Метод toLowerCase (Doka.guide)",
          url: "https://doka.guide/js/string-tolowercase/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Зачем приводить и значение поиска, и имя к lowerCase() перед проведением включает (includes)?",
          answer:
            'По умолчанию поисковое сравнение строк в JS учитывает регистр символов ("Anna" !== "anna"). Приведение обеих строк к .toLowerCase() или .toUpperCase() обеспечивает корректный регистронезависимый поиск.',
        },
      ],
      checklist: [
        "Фильтрация выполняется через .filter() + .includes() без мутации исходного массива",
        "Поиск регистронезависимый: обе строки приведены к .toLowerCase()",
        "Список перерисовывается реактивно при изменении строки поиска",
        "Каждый элемент списка имеет уникальный key (не индекс массива)",
      ],
    },
  {
      id: "w11",
      title: "12. Фильтрация выпадающим списком (Select)",
      desc: "Реализуйте выпадающий список <select> для фильтрации массива товаров по категории.",
      candidate: WarmupCandidate11,
      rawCandidate: WarmupCandidate11Raw,
      solution: WarmupSolution11,
      rawSolution: WarmupSolution11Raw,
      filepath: "src/react/tasks/1_warmup/11_SelectFilter.jsx",
      articles: [
        {
          title: "Тег select в React",
          urlTitle: "Элемент select (React.dev)",
          url: "https://react.dev/reference/react-dom/components/select",
        },
        {
          title: "Фильтрация массивов",
          urlTitle: "Метод Array.prototype.filter() (Doka.guide)",
          url: "https://doka.guide/js/array-filter/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Как работает управляемый тег <select> в React?",
          answer:
            "В React для <select> передается проп value, соотнесенный со стейтом, и обработчик onChange, считывающий e.target.value при смене опции.",
        },
      ],
      checklist: [
        "Тег <select> является управляемым: value={selectedCategory} и onChange",
        "Состояние содержит выбранную категорию (по умолчанию 'Все')",
        "При выборе 'Все' отображаются все элементы",
        "При выборе конкретной категории массив фильтруется через .filter()",
      ],
    },
  {
      id: "w25",
      title: "13. CRUD массива в состоянии",
      desc: "Реализуйте базовые операции со списком задач: добавление новой задачи через spread [...prev, newTodo], переключение completed через .map() и удаление по id через .filter().",
      candidate: WarmupCandidate25,
      rawCandidate: WarmupCandidate25Raw,
      solution: WarmupSolution25,
      rawSolution: WarmupSolution25Raw,
      filepath: "src/react/tasks/1_warmup/25_ArrayCrud.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Иммутабельный CRUD массива",
          isRecommended: true,
          badge: "Иммутабельный CRUD",
          recommendationNote: "Использование чистых методов .map() и .filter(), а также спред-оператора [...prev] гарантирует создание новых ссылок без мутации исходного массива.",
          rawSolution: WarmupSolution25Raw,
          filepath: "src/react/solutions/1_warmup/25_ArrayCrud.jsx",
        },
      ],
      articles: [
        {
          title: "Массивы в состоянии (React.dev)",
          urlTitle: "Обновление массивов в состоянии (React.dev)",
          url: "https://react.dev/learn/updating-arrays-in-state",
        },
        {
          title: "Иммутабельность в React (Doka.guide)",
          urlTitle: "Неизменяемость состояния (Doka.guide)",
          url: "https://doka.guide/js/react-immutability/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Почему методы push, pop, splice и sort нельзя использовать напрямую с массивом состояния в React?",
          answer: "Они мутируют исходный массив на месте, оставляя ссылку на объект прежней. При вызове setState с той же ссылкой React отменяет рендеринг (Object.is). Вместо них используются чистые методы: concat, filter, map, slice или spread [...prev].",
        },
        {
          question: "Как обновить конкретное поле одного элемента массива по его id?",
          answer: "С помощью метода .map(): prev.map(item => item.id === targetId ? { ...item, completed: !item.completed } : item).",
        },
      ],
      checklist: [
        "Добавление элемента выполняется иммутабельно через [...prev, newItem]",
        "Удаление элемента выполняется иммутабельно через .filter(item => item.id !== id)",
        "Обновление элемента выполняется иммутабельно через .map() с копированием объекта через { ...item }",
        "Каждый элемент списка имеет стабильный уникальный key={item.id}",
        "Не используются мутирующие методы push, splice или прямое присваивание по индексу",
      ],
    },
  {
      id: "w13",
      title: "14. async/await (Синтаксис)",
      desc: "// Напиши синтаксис запроса + try catch + обработка ошибки",
      isRaw: true,
      rawCandidate: WarmupCandidate13,
      rawSolution: WarmupSolution13,
      filepath: "src/react/tasks/1_warmup/13_AsyncAwait.js",
      articles: [
        {
          title: "Async/Await в JS",
          urlTitle: "Асинхронные функции async/await (LearnJS)",
          url: "https://learn.javascript.ru/async-await",
        },
        {
          title: "Асинхронный JavaScript",
          urlTitle: "async/await в детали (Doka.guide)",
          url: "https://doka.guide/js/async-await/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Какое главное преимущество синтаксиса async/await перед цепочкой .then().catch()?",
          answer:
            "Async/await превращает асинхронный код в линейную плоскую структуру, которую проще читать, отлаживать и обрабатывать единым блоком try/catch.",
        },
      ],
      checklist: [
        "Функция объявлена как async и использует await для ожидания промисов",
        "Ошибки перехватываются в блоке try/catch",
        "Понимание того, что async функция всегда возвращает Promise",
        "Не используется .then().catch() вместо try/catch внутри async функции",
      ],
    },
  {
      id: "w14",
      title: "15. async/await (Запрос)",
      desc: "Напишите функцию fetchUsers, которая делает GET-запрос к API по адресу https://jsonplaceholder.typicode.com/users и возвращает список пользователей в виде массива данных.",
      isRaw: true,
      rawCandidate: WarmupCandidate14,
      rawSolution: WarmupSolution14,
      filepath: "src/react/tasks/1_warmup/14_AsyncAwaitFetch.js",
      articles: [
        {
          title: "Запросы Fetch API",
          urlTitle: "Сеть: Fetch (LearnJS)",
          url: "https://learn.javascript.ru/fetch",
        },
        {
          title: "Обработка ошибок в Fetch",
          urlTitle: "Промисы и fetch (Doka.guide)",
          url: "https://doka.guide/js/fetch/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Попадает ли сетевой ответ с HTTP статусом 404 или 500 в блок catch при вызове fetch()?",
          answer:
            "Нет! fetch() отклоняет промис только при физическом сетевом сбое (CORS, разрыв соединения). Статусы 404 или 500 приходят как успешный ответ, поэтому нужно явно проверять свойство res.ok === false.",
        },
      ],
      checklist: [
        "Использована await fetch(url) для выполнения GET-запроса",
        "Ответ парсится через await res.json()",
        "Проверяется res.ok для обработки HTTP-ошибок (404, 500)",
        "Блок try/catch перехватывает как сетевые, так и HTTP ошибки",
      ],
    },
  {
      id: "w15",
      title: "16. useEffect (Синтаксис)",
      desc: "// Напиши базовый синтаксис useEffect",
      isRaw: true,
      rawCandidate: WarmupCandidate15,
      rawSolution: WarmupSolution15,
      filepath: "src/react/tasks/1_warmup/15_UseEffectBasic.js",
      articles: [
        {
          title: "Хук useEffect (React.dev)",
          urlTitle: "Документация useEffect (React.dev)",
          url: "https://react.dev/reference/react/useEffect",
        },
        {
          title: "Зависимости эффекта",
          urlTitle: "Зависимости эффекта (Doka.guide)",
          url: "https://doka.guide/js/react-use-effect/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Когда именно вызывается функция очистки (cleanup), возвращаемая из useEffect?",
          answer:
            "Она вызывается в 2 случаях: перед размонтированием компонента (unmount) и прямо перед следующим запуском данного эффекта при изменении его зависимостей.",
        },
      ],
      checklist: [
        "useEffect принимает колбэк-функцию и массив зависимостей",
        "Пустой массив [] запускает эффект только при монтировании",
        "Функция очистки return () => {} вызывается при размонтировании",
        "Колбэк useEffect НЕ является async-функцией напрямую",
      ],
    },
  {
      id: "w16",
      title: "17. useEffect (Запрос)",
      desc: "Напишите GET-запрос к API и отрисуйте список имен пользователей в виде <ul><li></li></ul> с использованием useEffect и useState.",
      candidate: WarmupCandidate16,
      rawCandidate: WarmupCandidate16Raw,
      solution: WarmupSolution16,
      rawSolution: WarmupSolution16Raw,
      filepath: "src/react/tasks/1_warmup/16_UseEffectFetch.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: GET-запрос в useEffect",
          isRecommended: true,
          badge: "Запрос при монтировании",
          recommendationNote: "Вызов асинхронной функции внутри useEffect с пустым массивом зависимостей гарантирует однократный сетевой запрос при монтировании компонента.",
          rawSolution: WarmupSolution16Raw,
          filepath: "src/react/solutions/1_warmup/16_UseEffectFetch.jsx",
        },
      ],
      articles: [
        {
          title: "Загрузка данных в useEffect",
          urlTitle: "Загрузка данных в эффектах (React.dev)",
          url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
        },
        {
          title: "Очистка эффекта",
          urlTitle: "Очистка асинхронных эффектов (Doka.guide)",
          url: "https://doka.guide/js/react-use-effect/#ochistka-effekta",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Почему передача async-функции напрямую в useEffect(async () => {}) вызывает предупреждение React?",
          answer:
            "async-функция возвращает Promise. Но useEffect ожидает, что возвращаемое значение будет либо undefined, либо функцией очистки. Обертка в внутреннюю асинхронную функцию внутри колбэка решает проблему.",
        },
      ],
      checklist: [
        "Async-функция объявлена ВНУТРИ useEffect и вызвана сразу",
        "Массив зависимостей useEffect содержит [] для однократного запроса при монтировании",
        "Обработаны состояния loading и error наряду с данными",
        "Используется await fetch + await res.json() внутри try/catch",
      ],
    },
  {
      id: "w17",
      title: "18. useEffect (AbortController)",
      desc: "Напишите GET-запрос к API с отменой запроса через AbortController в функции очистки useEffect при размонтировании.",
      candidate: WarmupCandidate17,
      rawCandidate: WarmupCandidate17Raw,
      solution: WarmupSolution17,
      rawSolution: WarmupSolution17Raw,
      filepath: "src/react/tasks/1_warmup/17_UseEffectAbortController.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Отмена запроса через AbortController",
          isRecommended: true,
          badge: "Отмена через AbortController",
          recommendationNote: "Отмена сетевого запроса в функции очистки useEffect предотвращает утечки памяти и race conditions при быстром размонтировании компонента.",
          rawSolution: WarmupSolution17Raw,
          filepath: "src/react/solutions/1_warmup/17_UseEffectAbortController.jsx",
        },
      ],
      articles: [
        {
          title: "Отмена асинхронных операций",
          urlTitle: "Отмена асинхронных запросов в fetch (Doka.guide)",
          url: "https://doka.guide/js/fetch/#otmena-zaprosa",
        },
        {
          title: "Очистка эффекта",
          urlTitle: "Синхронизация эффектов и отмена (React.dev)",
          url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Почему необходимо обрабатывать и отфильтровывать e.name === 'AbortError' при отмене fetch?",
          answer:
            "Вызов controller.abort() приводит к тому, что fetch отклоняет Promise с ошибкой типа AbortError. Если не обработать это исключение в catch, оно попадет в обработчик ошибок стейта как упавший сетевой запрос.",
        },
      ],
      checklist: [
        "Экземпляр AbortController создается внутри useEffect",
        "signal передается вторым аргументом в fetch(url, { signal })",
        "controller.abort() вызывается в функции очистки return () => {}",
        "Ошибка AbortError фильтруется и не устанавливает статус ошибки",
      ],
    },
  {
      id: "w27",
      title: "19. Таймер и интервал в useEffect",
      desc: "Реализуйте секундомер с setInterval в useEffect. Обеспечьте обязательную очистку clearInterval при размонтировании и используйте функциональный сеттер setSeconds(prev => prev + 1) для защиты от Stale Closure.",
      candidate: WarmupCandidate27,
      rawCandidate: WarmupCandidate27Raw,
      solution: WarmupSolution27,
      rawSolution: WarmupSolution27Raw,
      filepath: "src/react/tasks/1_warmup/27_UseEffectTimer.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Интервал в useEffect",
          isRecommended: true,
          badge: "Интервал без Stale Closure",
          recommendationNote: "Функциональный сеттер prev => prev + 1 позволяет оставить массив зависимостей [] пустым и не пересоздавать интервал на каждый тик.",
          rawSolution: WarmupSolution27Raw,
          filepath: "src/react/solutions/1_warmup/27_UseEffectTimer.jsx",
        },
      ],
      articles: [
        {
          title: "Синхронизация с эффектами (React.dev)",
          urlTitle: "Очистка эффектов (React.dev)",
          url: "https://react.dev/learn/synchronizing-with-effects",
        },
        {
          title: "Таймеры в React (Doka.guide)",
          urlTitle: "setInterval и хуки React (Doka.guide)",
          url: "https://doka.guide/js/react-use-effect/#ochistka-effekta",
        },
      ],
      interviewerQuestions: [
        {
          question: "Почему при setSeconds(seconds + 1) внутри setInterval таймер увеличивается только один раз при пустом массиве зависимостей []?",
          answer: "Это классическая проблема устаревшего замыкания (Stale Closure). Колбэк интервала замкнул начальное значение seconds (0) в момент создания эффекта. Без функциональной формы (prev => prev + 1) он на каждом тике вычисляет 0 + 1.",
        },
        {
          question: "Зачем возвращать clearInterval(id) из useEffect?",
          answer: "Если не очистить интервал при размонтировании, он продолжит работать в фоне, вызывая утечку памяти и пытаясь обновить состояние уже удаленного из DOM компонента.",
        },
      ],
      checklist: [
        "Интервал запускается в useEffect с пустым массивом зависимостей []",
        "Используется функциональная форма обновления состояния: setSeconds(prev => prev + 1)",
        "Функция очистки return () => clearInterval(id) зарегистрирована в useEffect",
        "Кнопка сброса обнуляет секундомер",
      ],
    },
  {
      id: "w28",
      title: "20. Подписка на глобальные события окна",
      desc: "Реализуйте подписку на глобальное событие keydown окна браузера для закрытия модального окна по нажатию клавиши Escape. Обязательно удаляйте слушатель в функции очистки useEffect.",
      candidate: WarmupCandidate28,
      rawCandidate: WarmupCandidate28Raw,
      solution: WarmupSolution28,
      rawSolution: WarmupSolution28Raw,
      filepath: "src/react/tasks/1_warmup/28_UseEffectEventListener.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Подписка на события окна",
          isRecommended: true,
          badge: "Слушатель с отпиской",
          recommendationNote: "Подписка активируется только при открытии модалки, а симметричный removeEventListener гарантирует отсутствие утечек памяти.",
          rawSolution: WarmupSolution28Raw,
          filepath: "src/react/solutions/1_warmup/28_UseEffectEventListener.jsx",
        },
      ],
      articles: [
        {
          title: "Подписка на внешние системы (React.dev)",
          urlTitle: "События браузера в useEffect (React.dev)",
          url: "https://react.dev/learn/synchronizing-with-effects#how-to-handle-subscribing-to-events",
        },
        {
          title: "События клавиатуры (LearnJS)",
          urlTitle: "События клавиатуры keydown и keyup (LearnJS)",
          url: "https://learn.javascript.ru/keyboard-events",
        },
      ],
      interviewerQuestions: [
        {
          question: "Что произойдет, если передать анонимную функцию в window.addEventListener('keydown', e => ...) и попытаться снять ее в cleanup через removeEventListener('keydown', e => ...)?",
          answer: "Слушатель не удалится! removeEventListener требует ровно ту же самую ссылку на функцию в памяти. Две анонимные стрелочные функции имеют разные ссылки, поэтому подписка останется активной навсегда.",
        },
      ],
      checklist: [
        "window.addEventListener вызывается внутри useEffect с именованной функцией-обработчиком",
        "Проверяется нажатие клавиши e.key === 'Escape'",
        "Симметричный window.removeEventListener вызывается в функции очистки",
        "Зависимость [isOpen] обеспечивает подписку только в активном состоянии модалки",
      ],
    },
  {
      id: "w22",
      title: "21. useRef (Синтаксис)",
      desc: "// Напиши базовый синтаксис useRef",
      isRaw: true,
      rawCandidate: WarmupCandidate22,
      rawSolution: WarmupSolution22,
      filepath: "src/react/tasks/1_warmup/22_UseRefBasic.js",
      articles: [
        {
          title: "Хук useRef (React.dev)",
          urlTitle: "Документация useRef (React.dev)",
          url: "https://react.dev/reference/react/useRef",
        },
        {
          title: "useRef в Doka",
          urlTitle: "Хук useRef (Doka.guide)",
          url: "https://doka.guide/js/react-use-ref/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Вызывает ли изменение свойства ref.current = value повторный рендер компонента?",
          answer:
            "Нет! Запись в ref.current мутирует обычный JS-объект бесшумно без запуска процедуры reconciliation и повторного рендера.",
        },
      ],
      checklist: [
        "useRef создаёт объект { current: initialValue } который сохраняется между рендерами",
        "Изменение ref.current НЕ вызывает повторный рендер компонента",
        "useRef используется для хранения DOM-ссылок и мутабельных значений",
        "Понимание разницы: useState вызывает рендер, useRef — нет",
      ],
    },
  {
      id: "w23",
      title: "22. useRef (Управление фокусом)",
      desc: "Напишите компонент, который устанавливает фокус на инпут при клике на кнопку с помощью useRef.",
      candidate: WarmupCandidate23,
      rawCandidate: WarmupCandidate23Raw,
      solution: WarmupSolution23,
      rawSolution: WarmupSolution23Raw,
      filepath: "src/react/tasks/1_warmup/23_UseRefFocus.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Управление фокусом через ref",
          isRecommended: true,
          badge: "Управление фокусом через ref",
          recommendationNote: "Прямой доступ к DOM-элементу через ref.current.focus() без лишних перерендеров всего компонента.",
          rawSolution: WarmupSolution23Raw,
          filepath: "src/react/solutions/1_warmup/23_UseRefFocus.jsx",
        },
      ],
      articles: [
        {
          title: "Управление DOM через refs",
          urlTitle: "Манипуляция DOM с refs (React.dev)",
          url: "https://react.dev/learn/manipulating-the-dom-with-refs",
        },
        {
          title: "Управление фокусом",
          urlTitle: "Метод elem.focus() (LearnJS)",
          url: "https://learn.javascript.ru/focus-blur",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "В какой момент жизненного цикла поле ref.current становится доступным?",
          answer:
            "Оно наполняется ссылкой на DOM-узел только после фазы монтирования (commit phase), когда React физически вставляет узел в браузерный DOM. К нему можно впервые обратиться в useEffect.",
        },
      ],
      checklist: [
        "Реф создан через useRef(null) и привязан к инпуту через prop ref={inputRef}",
        "Фокус устанавливается через inputRef.current.focus() по клику на кнопку",
        "ref.current доступен только после монтирования (commit phase)",
        "Не используется document.getElementById для доступа к DOM",
      ],
    },
  {
      id: "w24",
      title: "23. useRef (Неконтролируемая форма)",
      desc: "Напишите компонент неконтролируемой формы: считывание значения инпута через ref, вывод в console.log, очистка поля и сброс фокуса.",
      candidate: WarmupCandidate24,
      rawCandidate: WarmupCandidate24Raw,
      solution: WarmupSolution24,
      rawSolution: WarmupSolution24Raw,
      filepath: "src/react/tasks/1_warmup/24_UseRefUncontrolledForm.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Неконтролируемая форма",
          isRecommended: true,
          badge: "Неконтролируемая форма",
          recommendationNote: "Считывание значения напрямую из inputRef.current.value избавляет от накладных расходов useState на каждый введённый символ.",
          rawSolution: WarmupSolution24Raw,
          filepath: "src/react/solutions/1_warmup/24_UseRefUncontrolledForm.jsx",
        },
      ],
      articles: [
        {
          title: "Ссылки на значения",
          urlTitle: "Хранение значений с refs (React.dev)",
          url: "https://react.dev/learn/referencing-values-with-refs",
        },
        {
          title: "Неконтролируемые формы",
          urlTitle: "Неконтролируемые компоненты (Doka.guide)",
          url: "https://doka.guide/js/react-forms/#nekontroliruemye-komponenty",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "В чем главное преимущество useRef над useState в форме из 30 полей ввода?",
          answer:
            "Ввод текста пользователем в инпут не вызывает 30 постоянных повторных рендеров всего компонента на каждый символ, так как состояние поля держится в самом DOM.",
        },
      ],
          checklist: [
        "Значение инпута считывается через ref.current.value, а не через useState",
        "После отправки поле очищается: ref.current.value = ''",
        "Фокус возвращается на инпут после сброса: ref.current.focus()",
        "Форма является неконтролируемой (uncontrolled) — React не управляет value",
      ],
    },
  {
      id: "w29",
      title: "24. Хранение значений между рендерами в useRef",
      desc: "Реализуйте секундомер с кнопками Старт, Стоп и Сброс, используя useRef для хранения ID активного таймера без вызова лишних рендеров компонента.",
      candidate: WarmupCandidate29,
      rawCandidate: WarmupCandidate29Raw,
      solution: WarmupSolution29,
      rawSolution: WarmupSolution29Raw,
      filepath: "src/react/tasks/1_warmup/29_UseRefValue.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Хранение ID таймера в ref",
          isRecommended: true,
          badge: "Non-DOM useRef",
          recommendationNote: "useRef хранит мутабельный timerId между рендерами. Изменение timerRef.current не вызывает повторный рендер, в отличие от useState.",
          rawSolution: WarmupSolution29Raw,
          filepath: "src/react/solutions/1_warmup/29_UseRefValue.jsx",
        },
      ],
      articles: [
        {
          title: "Хранение значений с ref (React.dev)",
          urlTitle: "useRef для значений (React.dev)",
          url: "https://react.dev/learn/referencing-values-with-refs",
        },
        {
          title: "useRef в Doka",
          urlTitle: "Мутабельные рефы (Doka.guide)",
          url: "https://doka.guide/js/react-use-ref/",
        },
      ],
      interviewerQuestions: [
        {
          question: "В чем разница между обычной переменной let timerId в теле компонента, useState и useRef?",
          answer: "Обычная переменная let timerId переинициализируется заново при каждом рендере. useState сохраняет значение между рендерами, но его изменение вызывает рендер. useRef сохраняет значение между рендерами и его мутация НЕ вызывает рендер.",
        },
      ],
      checklist: [
        "timerRef инициализирован через useRef(null)",
        "Кнопка Старт сохраняет id интервала в timerRef.current и блокирует повторные запуски",
        "Кнопка Стоп очищает интервал и сбрасывает timerRef.current = null",
        "В useEffect предусмотрена очистка таймера при размонтировании",
        "Не используется useState для хранения чисто технического timerId",
      ],
    },
  {
      id: "w18",
      title: "25. useMemo (Синтаксис)",
      desc: "// Напиши базовый синтаксис useMemo",
      isRaw: true,
      rawCandidate: WarmupCandidate18,
      rawSolution: WarmupSolution18,
      filepath: "src/react/tasks/1_warmup/18_UseMemoBasic.js",
      articles: [
        {
          title: "Хук useMemo (React.dev)",
          urlTitle: "Документация useMemo (React.dev)",
          url: "https://react.dev/reference/react/useMemo",
        },
        {
          title: "useMemo в Doka",
          urlTitle: "Хук useMemo (Doka.guide)",
          url: "https://doka.guide/js/react-use-memo/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Для чего предназначен хук useMemo?",
          answer:
            "Он кэширует (запоминает) результат выполнения функции вычислений между рендерами и пересчитывает его только при изменении значений в массиве зависимостей.",
        },
      ],
      checklist: [
        "useMemo принимает функцию-фабрику и массив зависимостей",
        "Мемоизированное значение пересчитывается ТОЛЬКО при изменении зависимостей",
        "Понимание разницы: useMemo кэширует значение, useCallback кэширует функцию",
        "Не используется useMemo для тривиальных вычислений (a + b)",
      ],
    },
  {
      id: "w19",
      title: "26. useMemo (Практика)",
      desc: "Мемоизируйте фильтрацию большого массива пользователей (10 000 элементов), чтобы она не пересчитывалась при ре-рендерах, вызванных сменой темы, а срабатывала только при изменении поискового запроса.",
      candidate: WarmupCandidate19,
      rawCandidate: WarmupCandidate19Raw,
      solution: WarmupSolution19,
      rawSolution: WarmupSolution19Raw,
      filepath: "src/react/tasks/1_warmup/19_UseMemoPractice.jsx",
      articles: [
        {
          title: "Пропуск вычислений",
          urlTitle: "Пропуск тяжелых вычислений (React.dev)",
          url: "https://react.dev/reference/react/useMemo#skipping-expensive-re-calculations",
        },
        {
          title: "Оптимизация списка",
          urlTitle: "Оптимизация списка с useMemo (Doka.guide)",
          url: "https://doka.guide/js/react-use-memo/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Стоит ли обворачивать в useMemo абсолютно все массивы и вычисления в проекте?",
          answer:
            "Нет! Вызов useMemo и сравнение массива зависимостей тоже расходуют память. Оптимизация нужна при тяжелых вычислениях или необходимости сохранить ссылочную целостность объектов.",
        },
      ],
      checklist: [
        "Фильтрация списка обёрнута в useMemo с зависимостями [query, items]",
        "Сравнение строк выполняется через .toLowerCase() для регистронезависимости",
        "Метод .filter() создаёт новый массив без мутации исходного",
        "useMemo предотвращает пересчёт при каждом рендере компонента",
      ],
    },
  {
      id: "w20",
      title: "27. useCallback (Синтаксис)",
      desc: "// Напиши базовый синтаксис useCallback",
      isRaw: true,
      rawCandidate: WarmupCandidate20,
      rawSolution: WarmupSolution20,
      filepath: "src/react/tasks/1_warmup/20_UseCallbackBasic.js",
      articles: [
        {
          title: "Хук useCallback (React.dev)",
          urlTitle: "Документация useCallback (React.dev)",
          url: "https://react.dev/reference/react/useCallback",
        },
        {
          title: "useCallback в Doka",
          urlTitle: "Хук useCallback (Doka.guide)",
          url: "https://doka.guide/js/react-use-callback/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "В чем разница между useCallback(fn, deps) и useMemo(() => fn, deps)?",
          answer:
            "Они работают одинаково под капотом. useCallback(fn, deps) является удобным синтаксическим сахаром для мемоизации самой функции-колбэка.",
        },
      ],
      checklist: [
        "useCallback принимает функцию-колбэк и массив зависимостей",
        "Возвращает мемоизированную ссылку на ту же функцию между рендерами",
        "Понимание: useCallback(fn, deps) === useMemo(() => fn, deps)",
        "Без React.memo на дочернем компоненте useCallback не предотвращает рендер",
      ],
    },
  {
      id: "w21",
      title: "28. useCallback (Практика)",
      desc: "Создайте мемоизированную функцию-обработчик increment с помощью хука useCallback с пустым массивом зависимостей и передайте в компонент, защищенный React.memo.",
      candidate: WarmupCandidate21,
      rawCandidate: WarmupCandidate21Raw,
      solution: WarmupSolution21,
      rawSolution: WarmupSolution21Raw,
      filepath: "src/react/tasks/1_warmup/21_UseCallbackPractice.jsx",
      articles: [
        {
          title: "Мемоизация компонентов",
          urlTitle: "Компонент React.memo (React.dev)",
          url: "https://react.dev/reference/react/memo",
        },
        {
          title: "Мемоизация обработчиков",
          urlTitle: "Мемоизация функций в React (Doka.guide)",
          url: "https://doka.guide/js/react-use-callback/",
        },
      ],
      interviewerQuestions: [
        {
          question:
            "Почему useCallback не предотвращает рендер дочернего компонента без применения React.memo?",
          answer:
            "По умолчанию дочерние компоненты перерисовываются всегда, когда рендерится родитель. Сохранение ссылки на функцию дает эффект только тогда, когда дочерний компонент обернут в React.memo.",
        },
      ],
      checklist: [
        "Обработчик increment обёрнут в useCallback с корректными зависимостями",
        "Используется функциональная форма обновления setState(prev => prev + 1)",
        "Дочерний компонент обёрнут в React.memo для предотвращения лишних рендеров",
        "Массив зависимостей useCallback пуст [], т.к. используется функциональная форма setState",
      ],
    },
  {
      id: "w30",
      title: "29. Вычисляемое состояние (Derived State)",
      desc: "Рассчитайте общее количество товаров и итоговую стоимость корзины на лету прямо во время рендеринга без заведения избыточных useState и без useEffect.",
      candidate: WarmupCandidate30,
      rawCandidate: WarmupCandidate30Raw,
      solution: WarmupSolution30,
      rawSolution: WarmupSolution30Raw,
      filepath: "src/react/tasks/1_warmup/30_DerivedState.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Вычисляемое состояние",
          isRecommended: true,
          badge: "Derived State на лету",
          recommendationNote: "Прямой расчет через .reduce() во время рендера устраняет необходимость синхронизировать стейты и избавляет от лишних рендеров.",
          rawSolution: WarmupSolution30Raw,
          filepath: "src/react/solutions/1_warmup/30_DerivedState.jsx",
        },
      ],
      articles: [
        {
          title: "Вам не нужен useEffect (React.dev)",
          urlTitle: "Вычисляемые значения вместо эффектов (React.dev)",
          url: "https://react.dev/learn/you-might-not-need-an-effect",
        },
        {
          title: "Производное состояние (Doka.guide)",
          urlTitle: "Производный стейт (Doka.guide)",
          url: "https://doka.guide/js/react-use-state/#proizvodnoe-sostoyanie",
        },
      ],
      interviewerQuestions: [
        {
          question: "Почему синхронизация вычисляемых данных через useEffect (например, useEffect(() => setTotalPrice(...), [items])) считается грубым антипаттерном?",
          answer: "Она вызывает каскадные рендеры (первый рендер со старыми данными, затем срабатывает эффект и запускает второй рендер), увеличивает риск рассинхронизации данных и усложняет код. Если значение можно рассчитать из имеющегося стейта/пропсов, его нужно вычислять прямо в теле компонента.",
        },
      ],
      checklist: [
        "totalCount и totalPrice вычисляются в теле функции через items.reduce()",
        "Отсутствуют избыточные useState и useEffect для вычисляемых данных",
        "Реализовано изменение количества товара с защитой от нулевого/отрицательного count",
        "При изменении элементов корзины итоговые суммы обновляются мгновенно за один рендер",
      ],
    },
  {
      id: "w26",
      title: "30. Поднятие состояния (Lifting State Up)",
      desc: "Организуйте однонаправленный поток данных: родительский компонент хранит состояние активной вкладки, а дочерний компонент кнопки получает пропсы и вызывает колбэк изменения наверх.",
      candidate: WarmupCandidate26,
      rawCandidate: WarmupCandidate26Raw,
      solution: WarmupSolution26,
      rawSolution: WarmupSolution26Raw,
      filepath: "src/react/tasks/1_warmup/26_LiftingStateUp.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Поднятие состояния",
          isRecommended: true,
          badge: "Поднятие состояния",
          recommendationNote: "Состояние хранится в ближайшем общем предке (TabsContainer), а дочерние кнопки являются чисто презентационными компонентами, управляемыми через props.",
          rawSolution: WarmupSolution26Raw,
          filepath: "src/react/solutions/1_warmup/26_LiftingStateUp.jsx",
        },
      ],
      articles: [
        {
          title: "Поднятие состояния (React.dev)",
          urlTitle: "Lifting State Up (React.dev)",
          url: "https://react.dev/learn/sharing-state-between-components",
        },
        {
          title: "Передача данных между компонентами (Doka.guide)",
          urlTitle: "Пропсы и события в React (Doka.guide)",
          url: "https://doka.guide/js/react-props/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Что означает паттерн 'Props Down, Events Up' в React?",
          answer: "Данные передаются сверху вниз от родителя к детям через props, а события и намерения изменить состояние передаются снизу вверх через вызов переданных функций-колбэков.",
        },
        {
          question: "Когда необходимо применять поднятие состояния (Lifting State Up)?",
          answer: "Когда двум или более сестринским компонентам требуется доступ к одним и тем же изменяемым данным или когда они должны координировать свое поведение.",
        },
      ],
      checklist: [
        "Состояние activeTab хранится в родительском компоненте TabsContainer",
        "Дочерний компонент TabButton принимает пропсы id, label, isActive, onSelect",
        "Клик по кнопке вызывает onSelect(id), передавая идентификатор родителю",
        "Родительский компонент реактивно обновляет отображаемый контент выбранной вкладки",
      ],
    },
  {
      id: "w31",
      title: "31. Пользовательский хук (useToggle)",
      desc: "Создайте собственный переиспользуемый хук useToggle(initialValue = false), возвращающий кортеж [value, toggle, setValue], и примените его для управления видимостью блока в интерфейсе.",
      candidate: WarmupCandidate31,
      rawCandidate: WarmupCandidate31Raw,
      solution: WarmupSolution31,
      rawSolution: WarmupSolution31Raw,
      filepath: "src/react/tasks/1_warmup/31_CustomHookUseToggle.jsx",
      solutions: [
        {
          title: "Рекомендуемое решение: Хук useToggle",
          isRecommended: true,
          badge: "Кастомный хук",
          recommendationNote: "Хук useToggle изолирует базовую логику переключателя и предоставляет стабильный мемоизированный метод toggle.",
          rawSolution: WarmupSolution31Raw,
          filepath: "src/react/solutions/1_warmup/31_CustomHookUseToggle.jsx",
        },
      ],
      articles: [
        {
          title: "Пользовательские хуки (React.dev)",
          urlTitle: "Создание собственных хуков (React.dev)",
          url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
        },
        {
          title: "Кастомные хуки в Doka",
          urlTitle: "Пользовательские хуки (Doka.guide)",
          url: "https://doka.guide/js/react-custom-hooks/",
        },
      ],
      interviewerQuestions: [
        {
          question: "Разделяют ли два компонента, использующие один и тот же кастомный хук, общее состояние?",
          answer: "Нет! Кастомные хуки переиспользуют только логику работы с состоянием, а не само состояние. При каждом вызове хука внутри компонента создается полностью независимый изолированный экземпляр стейта.",
        },
        {
          question: "Каковы обязательные правила именования кастомных хуков?",
          answer: "Имя хука должно строго начинаться с приставки 'use' в camelCase (например useToggle, useAuth). Это позволяет линтеру React проверять соблюдение правил хуков (вызов только на верхнем уровне, без условий и циклов).",
        },
      ],
      checklist: [
        "Хук useToggle назван с префиксом 'use' и принимает initialValue",
        "Хук возвращает массив [value, toggle, setValue]",
        "Метод toggle инвертирует булево состояние через функциональный сеттер",
        "Компонент ToggleDemo успешно использует хук для отображения контента",
      ],
    }
];

export const REFACTORING_TASKS = [
  {
    id: "r1",
    title: "1. Мутация состояния и потеря рендера",
    desc: "Найдите ошибку мутации встроенных объектов в состоянии и исправьте ее.",
    isRaw: true,
    rawCandidate: RefactoringCandidate1,
    rawSolution: RefactoringSolution1,
    filepath: "src/react/tasks/2_refactoring/1_StateMutation.js",
    articles: [
      {
        title: "Иммутабельность состояния",
        urlTitle: "Обновление объектов в состоянии (React.dev)",
        url: "https://react.dev/learn/updating-objects-in-state",
      },
      {
        title: "Spread оператор",
        urlTitle: "Клонирование и объединение объектов (LearnJS)",
        url: "https://learn.javascript.ru/object-copy",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему при прямой мутации объекта в состоянии updatedUser.settings.notifications = false компонент не перерисовывается?",
        answer:
          "React производит сравнение по ссылке (Object.is). Так как переменная унаследовала старую ссылку на объект user в памяти, React считает, что состояние не изменилось, и отменяет рендер.",
      },
    ],
    checklist: [
      "Объект обновляется иммутабельно через spread-оператор: { ...prev, field: value }",
      "Вложенные объекты также копируются: { ...prev, settings: { ...prev.settings, key: value } }",
      "Не используется прямая мутация: user.name = 'new' без создания копии",
      "Понимание того, что React сравнивает стейт по ссылке (Object.is)",
    ],
  },
  {
    id: "r2",
    title: "2. Эффект-синхронизатор",
    desc: "Удалите избыточный useEffect и переведите вычисления в производный стейт на лету.",
    isRaw: true,
    rawCandidate: RefactoringCandidate2,
    rawSolution: RefactoringSolution2,
    filepath: "src/react/tasks/2_refactoring/2_EffectSynchronizer.js",
    articles: [
      {
        title: "Вам не нужен useEffect",
        urlTitle: "Когда не нужен useEffect (React.dev)",
        url: "https://react.dev/learn/you-might-not-need-an-effect",
      },
      {
        title: "Производное состояние",
        urlTitle: "Производный стейт во время рендера (Doka.guide)",
        url: "https://doka.guide/js/react-use-state/#proizvodnoe-sostoyanie",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему вычисление полного имени fullName в useEffect является антипаттерном?",
        answer:
          "Это провоцирует каскадный каскад рендеров: первый рендер рисуется со старым именем, затем отрабатывает useEffect и вызывает второй рендер со свежим стейтом. Простой расчет прямо в теле компонента выполняется за 1 рендер.",
      },
    ],
    checklist: [
      "Избыточный useEffect удалён — значение вычисляется прямо в теле компонента",
      "Производное состояние (derived state) рассчитывается на лету при каждом рендере",
      "Нет каскадных рендеров: вычисление fullName выполняется за 1 проход",
      "Понимание антипаттерна: useEffect + setState для синхронизации данных",
    ],
  },
  {
    id: "r3",
    title: "3. Тормозящий интерфейс",
    desc: "Оптимизируйте компонент с помощью useMemo для тяжелых вычислений.",
    isRaw: true,
    rawCandidate: RefactoringCandidate3,
    rawSolution: RefactoringSolution3,
    filepath: "src/react/tasks/2_refactoring/3_ExpensiveCalculation.js",
    articles: [
      {
        title: "Оптимизация вычислений",
        urlTitle: "Хук useMemo (React.dev)",
        url: "https://react.dev/reference/react/useMemo",
      },
      {
        title: "Кэширование вычислений",
        urlTitle: "Хук useMemo (Doka.guide)",
        url: "https://doka.guide/js/react-use-memo/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как выявить компоненты с тяжелыми вычислениями с помощью React DevTools Profiler?",
        answer:
          "Вкладка Profiler позволяет записать сессию взаимодействия и подсвечивает жёлтым/красным цветом компоненты с большим Render Duration в миллисекундах.",
      },
    ],
    checklist: [
      "Тяжёлое вычисление обёрнуто в useMemo с корректным массивом зависимостей",
      "При вводе текста в другой инпут тяжёлый пересчёт не запускается заново",
      "Понимание: useMemo кэширует результат до изменения зависимостей",
      "Не используется useMemo для тривиальных операций (конкатенация строк, сумма)",
    ],
  },
  {
    id: "r4",
    title: "4. Лишние рендеры дочерних компонентов",
    desc: "Сохраняйте ссылочную идентичность функции с помощью useCallback.",
    isRaw: true,
    rawCandidate: RefactoringCandidate4,
    rawSolution: RefactoringSolution4,
    filepath: "src/react/tasks/2_refactoring/4_ChildReRenders.js",
    articles: [
      {
        title: "Мемоизация рендеров",
        urlTitle: "Компонент React.memo (React.dev)",
        url: "https://react.dev/reference/react/memo",
      },
      {
        title: "Ссылочная целостность",
        urlTitle: "Хук useCallback (Doka.guide)",
        url: "https://doka.guide/js/react-use-callback/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему объявление функции handleClick прямо в теле родителя ломает оптимизацию React.memo у ребенка?",
        answer:
          "При каждом рендере родителя создается новая функция с новым адресом в памяти. React.memo видит изменение ссылки в пропах и производит повторный рендер.",
      },
    ],
    checklist: [
      "Обработчик обёрнут в useCallback для сохранения ссылочной идентичности",
      "Дочерний компонент обёрнут в React.memo для предотвращения лишних рендеров",
      "Массив зависимостей useCallback содержит только необходимые значения",
      "Понимание: без React.memo на дочернем компоненте useCallback бесполезен",
    ],
  },
  {
    id: "r5",
    title: "5. Анти-паттерн преждевременной оптимизации",
    desc: "Удалите избыточную мемоизацию простейших вычислений и обработчиков.",
    isRaw: true,
    rawCandidate: RefactoringCandidate5,
    rawSolution: RefactoringSolution5,
    filepath: "src/react/tasks/2_refactoring/5_PrematureOptimization.js",
    articles: [
      {
        title: "Избыточная мемоизация",
        urlTitle: "Нужен ли useMemo везде? (React.dev)",
        url: "https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere",
      },
      {
        title: "Цена useMemo",
        urlTitle: "Когда не нужен useMemo (Doka.guide)",
        url: "https://doka.guide/js/react-use-memo/#kogda-ne-nuzhen-usememo",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "В чем состоит вред мемоизации простейших арифметических операций useMemo(() => a + b, [a, b])?",
        answer:
          "Вызов функции useMemo, выделение памяти под замыкание и перебор массива зависимостей тратят больше ресурсов CPU, чем сама операция сложения двух чисел.",
      },
    ],
    checklist: [
      "Удалены избыточные useMemo/useCallback для тривиальных вычислений",
      "Простые вычисления (a + b, форматирование строки) выполняются напрямую",
      "Понимание: вызов useMemo сам по себе тратит CPU и выделяет память",
      "Оптимизация применяется только при измеримых проблемах производительности",
    ],
  },
  {
    id: "r6",
    title: "6. Состояние гонки (Race Condition)",
    desc: "Используйте флаг отмены/актуальности в эффекте для предотвращения гонки запросов.",
    isRaw: true,
    rawCandidate: RefactoringCandidate6,
    rawSolution: RefactoringSolution6,
    filepath: "src/react/tasks/2_refactoring/6_RaceCondition.js",
    articles: [
      {
        title: "Race Condition в React",
        urlTitle: "Предотвращение race condition (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
      },
      {
        title: "Отмена запросов",
        urlTitle: "Отмена асинхронных запросов в fetch (Doka.guide)",
        url: "https://doka.guide/js/fetch/#otmena-zaprosa",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как возникает баг Race Condition при быстрой смене вкладок пользователем?",
        answer:
          "Сетевой запрос 1-й вкладки уходит раньше, но из-за задержки сервера прилетает ПОЗЖЕ запроса 2-й вкладки, перезаписывая экран устаревшими данными.",
      },
    ],
    checklist: [
      "Используется флаг let ignore = false для отслеживания актуальности эффекта",
      "Функция очистки useEffect устанавливает ignore = true при смене зависимостей",
      "Стейт обновляется только если !ignore (запрос всё ещё актуален)",
      "Используется async/await с try/catch для обработки ошибок запроса",
    ],
  },
  {
    id: "r7",
    title: "7. Спам запросами при вводе",
    desc: "Реализуйте кастомный хук useDebounce для откладывания поискового запроса при вводе текста.",
    isRaw: true,
    rawCandidate: RefactoringCandidate7,
    rawSolution: RefactoringSolution7,
    filepath: "src/react/tasks/2_refactoring/7_DebounceSearch.js",
    articles: [
      {
        title: "Паттерн Debounce",
        urlTitle: "Дебаунс вызова функции (LearnJS)",
        url: "https://learn.javascript.ru/task/debounce",
      },
      {
        title: "Кастомные хуки",
        urlTitle: "Создание кастомных хуков (React.dev)",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "В чем преимущество выноса логики debounce в кастомный хук useDebounce вместо написания setTimeout прямо в сетевом эффекте?",
        answer:
          "Кастомный хук useDebounce выносит задержку и очистку таймера в чистую переиспользуемую логику, изолируя эффект сетевого запроса от контроля за таймаутами (Single Responsibility Principle).",
      },
    ],
    checklist: [
      "Реализован кастомный хук useDebounce(value, delay) для откладывания значения",
      "useEffect с setTimeout и clearTimeout в функции очистки",
      "Компонент использует debouncedQuery вместо query для запросов к API",
      "Логика задержки вынесена в отдельный переиспользуемый хук (SRP)",
    ],
  },
  {
    id: "r8",
    title: "8. Утечка памяти",
    desc: "Очищайте глобальные слушатели событий (removeEventListener) при размонтировании.",
    isRaw: true,
    rawCandidate: RefactoringCandidate8,
    rawSolution: RefactoringSolution8,
    filepath: "src/react/tasks/2_refactoring/8_MemoryLeakScroll.js",
    articles: [
      {
        title: "Очистка эффектов",
        urlTitle: "Очистка подписок и слушателей (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects#cleaning-up-effects",
      },
      {
        title: "Сборка мусора",
        urlTitle: "Утечки памяти в JS (LearnJS)",
        url: "https://learn.javascript.ru/garbage-collection",
      },
    ],
    interviewerQuestions: [
      {
        question:
          'Почему незакрытый слушатель window.addEventListener("scroll") приводит к утечке памяти?',
        answer:
          "Слушатель удерживает ссылку на функцию-обработчик и замыкание всего размонтированного компонента, не позволяя Garbage Collector очистить оперативную память.",
      },
    ],
    checklist: [
      "addEventListener вызывается внутри useEffect при монтировании",
      "removeEventListener вызывается в функции очистки return () => {}",
      "Используется именованная функция-обработчик (не анонимная) для корректного удаления",
      "Понимание: без очистки слушатель живёт после размонтирования компонента",
    ],
  },
  {
    id: "r9",
    title: '9. "Ванильный" JavaScript в React (Доступ к DOM)',
    desc: "Используйте useRef вместо document.getElementById для работы с DOM-узлами.",
    isRaw: true,
    rawCandidate: RefactoringCandidate9,
    rawSolution: RefactoringSolution9,
    filepath: "src/react/tasks/2_refactoring/9_VanillaDOM.js",
    articles: [
      {
        title: "useRef вместо getElementById",
        urlTitle: "Манипуляции с DOM (React.dev)",
        url: "https://react.dev/learn/manipulating-the-dom-with-refs",
      },
      {
        title: "Работа с DOM элементами",
        urlTitle: "Доступ к DOM элементам (Doka.guide)",
        url: "https://doka.guide/js/react-use-ref/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему вызов document.getElementById в переиспользуемом компоненте ломает приложение при дублировании компонента на странице?",
        answer:
          "Оба экземпляра компонента получают дублирующийся id. document.getElementById всегда будет возвращать только самый первый инпут в документе.",
      },
    ],
    checklist: [
      "Используется useRef(null) + ref={inputRef} вместо document.getElementById",
      "Понимание: getElementById возвращает первый элемент с данным id в документе",
      "При дублировании компонента на странице useRef работает корректно",
      "DOM-операции (focus, scrollIntoView) выполняются через ref.current",
    ],
  },
  {
    id: "r10",
    title: "10. Лишние рендеры из-за технических данных",
    desc: "Храните технические данные (ID интервалов и таймеров) в useRef вместо useState.",
    isRaw: true,
    rawCandidate: RefactoringCandidate10,
    rawSolution: RefactoringSolution10,
    filepath: "src/react/tasks/2_refactoring/10_TechnicalDataState.js",
    articles: [
      {
        title: "Хранение данных без рендера",
        urlTitle: "Ссылки на значения (React.dev)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
      {
        title: "useState vs useRef",
        urlTitle: "Переменные без перерисовки (Doka.guide)",
        url: "https://doka.guide/js/react-use-ref/#xranenie-dannyx-bez-rerendera",
      },
    ],
    interviewerQuestions: [
      {
        question: "Почему хранение timerId в useState является антипаттерном?",
        answer:
          "Вызов setTimerId(id) инициирует лишний цикл рендера UI, хотя для пользователя внешний вид интерфейса от наличия самого ID никак не меняется.",
      },
    ],
    checklist: [
      "ID таймера/интервала хранится в useRef, а не в useState",
      "Изменение ref.current не вызывает повторный рендер компонента",
      "useState используется ТОЛЬКО для данных, влияющих на отображение UI",
      "Понимание: setTimerId() вызывает рендер, хотя UI от timerId не зависит",
    ],
  },
  {
    id: "r11",
    title: "11. Прокидывание рефа в кастомный компонент",
    desc: "Оберните кастомный компонент в React.forwardRef для получения ссылки на DOM-узел.",
    isRaw: true,
    rawCandidate: RefactoringCandidate11,
    rawSolution: RefactoringSolution11,
    filepath: "src/react/tasks/2_refactoring/11_ForwardRef.js",
    articles: [
      {
        title: "Перенаправление рефов",
        urlTitle: "Документация forwardRef (React.dev)",
        url: "https://react.dev/reference/react/forwardRef",
      },
      {
        title: "forwardRef в Doka",
        urlTitle: "forwardRef в React (Doka.guide)",
        url: "https://doka.guide/js/react-forward-ref/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему стандартный функциональный компонент не получает проп ref?",
        answer:
          "Проп ref является системным свойством React и не попадает в объект props. Для его перехвата требуется использовать React.forwardRef.",
      },
    ],
    checklist: [
      "Компонент обёрнут в React.forwardRef для перехвата ref из родителя",
      "ref пробрасывается на нужный DOM-элемент внутри кастомного компонента",
      "Понимание: ref — системное свойство React, не попадающее в props",
      "Родитель получает прямой доступ к DOM-узлу дочернего компонента",
    ],
  },
  {
    id: "r12",
    title: "12. Обрезанное модальное окно (React Portals)",
    desc: "Используйте createPortal для рендеринга модального окна в document.body.",
    isRaw: true,
    rawCandidate: RefactoringCandidate12,
    rawSolution: RefactoringSolution12,
    filepath: "src/react/tasks/2_refactoring/12_ReactPortals.js",
    articles: [
      {
        title: "Порталы в React",
        urlTitle: "Документация createPortal (React.dev)",
        url: "https://react.dev/reference/react-dom/createPortal",
      },
      {
        title: "createPortal в Doka",
        urlTitle: "createPortal в React (Doka.guide)",
        url: "https://doka.guide/js/react-portals/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Какую графическую проблему решает ReactDOM.createPortal при создании модальных окон?",
        answer:
          "Портал рендерит DOM-узел модалки в document.body, изолируя его от CSS-контейнеров с overflow: hidden, z-index или transform родителя.",
      },
    ],
    checklist: [
      "Модальное окно рендерится через ReactDOM.createPortal в document.body",
      "Портал изолирует модалку от CSS-контейнеров родителя (overflow: hidden, z-index)",
      "События React (onClick) всплывают по React-дереву, а не по DOM-дереву",
      "Понимание проблемы: overflow: hidden или transform на родителе обрезает модалку",
    ],
  },
  {
    id: "r13",
    title: '13. "Убийство" SPA классическими ссылками (React Router)',
    desc: "Замените теги a на Link из react-router-dom для перехода без перезагрузки.",
    isRaw: true,
    rawCandidate: RefactoringCandidate13,
    rawSolution: RefactoringSolution13,
    filepath: "src/react/tasks/2_refactoring/13_ReactRouterLinks.js",
    articles: [
      {
        title: "React Router Link",
        urlTitle: "Документация Link (React Router)",
        url: "https://reactrouter.com/en/main/components/link",
      },
      {
        title: "Клиентская навигация",
        urlTitle: "Навигация в SPA без перезагрузки (Doka.guide)",
        url: "https://doka.guide/tools/react-router/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Что происходит с состоянием (state) приложения при переходе по нативной ссылке href?",
        answer:
          "Браузер производит полный HTTP-запрос к серверу, что уничтожает всё оперативное состояние в памяти (Redux/Context) и перезагружает HTML-документ.",
      },
    ],
    checklist: [
      'Используется <Link to="/path"> из react-router-dom вместо <a href="/path">',
      "Навигация происходит без полной перезагрузки страницы (клиентский роутинг)",
      "Состояние приложения (Redux/Context) сохраняется при переходах",
      "Понимание: <a href> уничтожает SPA и перезагружает весь HTML-документ",
    ],
  },
  {
    id: "r14",
    title: "14. Хардкод URL и объект window (Программная навигация)",
    desc: "Используйте хуки useNavigate и useParams из react-router-dom.",
    isRaw: true,
    rawCandidate: RefactoringCandidate14,
    rawSolution: RefactoringSolution14,
    filepath: "src/react/tasks/2_refactoring/14_ProgrammaticNavigation.js",
    articles: [
      {
        title: "Программный переход",
        urlTitle: "Хук useNavigate (React Router)",
        url: "https://reactrouter.com/en/main/hooks/use-navigate",
      },
      {
        title: "Параметры URL",
        urlTitle: "Параметры URL в React Router (Doka.guide)",
        url: "https://doka.guide/tools/react-router/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему лучше использовать useNavigate() вместо прямого изменения window.location.href?",
        answer:
          "useNavigate() выполняет переход в рамках клиентского роутинга без перезагрузки страницы, сохраняя состояние в памяти приложения.",
      },
    ],
    checklist: [
      "Используется useNavigate() для программной навигации вместо window.location",
      "Используется useParams() для чтения динамических параметров URL",
      "Навигация сохраняет состояние SPA без перезагрузки страницы",
      "Понимание: window.location.href = url полностью перезагружает приложение",
    ],
  },
  {
    id: "r15",
    title: "15. Рефакторинг (Company X)",
    desc: "Исправьте ключевые антипаттерны, утечки таймера, мутации массивов и мемоизацию в TypeScript компоненте.",
    candidate: RefactoringCandidate15Comp,
    rawCandidate: RefactoringCandidate15,
    solution: RefactoringSolution15Comp,
    rawSolution: RefactoringSolution15,
    filepath: "src/react/tasks/2_refactoring/15_CompanyXRefactoring.tsx",
    articles: [
      {
        title: "Типичные ошибки React",
        urlTitle: "Переиспользование логики (React.dev)",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
      {
        title: "Чистая архитектура",
        urlTitle: "Чистый код компонентов (Doka.guide)",
        url: "https://doka.guide/js/react-children/",
      },
    ],
    interviewerQuestions: [
      {
        question: "Назовите 3 главных бага в компоненте Company X?",
        answer:
          "1) Таймер без очистки clearInterval при уходе со страницы. 2) Прямая мутация исходного массива методом items.sort(). 3) Фильтрация массива без useMemo при каждом рендере.",
      },
    ],
    checklist: [
      "Таймер очищен через clearInterval в функции очистки useEffect",
      "Массив сортируется иммутабельно: [...items].sort() вместо items.sort()",
      "Фильтрация обёрнута в useMemo для предотвращения пересчёта на каждый рендер",
      "Все три антипаттерна найдены и исправлены: таймер, мутация, мемоизация",
    ],
  },
  {
    id: "r16",
    title: "16. Рефакторинг (Company X)",
    desc: "Проведите рефакторинг компонента секундомера: вынесите стили в App.css, избавьтесь от прямого доступа к DOM, устраните утечки таймеров, вынесите логику в кастомный хук useTimer и отформатируйте вывод времени.",
    isMultiFile: true,
    candidate: RefactoringCandidate16,
    rawCandidate: `// App.jsx\n${RefactoringCandidate16_App}\n\n// App.css\n${RefactoringCandidate16_Css}`,
    solution: RefactoringSolution16,
    rawSolution: `// App.jsx\n${RefactoringSolution16_App}\n\n// App.css\n${RefactoringSolution16_Css}`,
    filepath: "src/react/tasks/2_refactoring/16_TimerRefactoring/App.jsx",
    files: [
      {
        name: "App.jsx",
        filepath: "src/react/tasks/2_refactoring/16_TimerRefactoring/App.jsx",
        candidateCode: RefactoringCandidate16_App,
        solutionCode: RefactoringSolution16_App,
      },
      {
        name: "App.css",
        filepath: "src/react/tasks/2_refactoring/16_TimerRefactoring/App.css",
        candidateCode: RefactoringCandidate16_Css,
        solutionCode: RefactoringSolution16_Css,
      },
    ],
    articles: [
      {
        title: "Реакция на ввод с помощью состояния",
        urlTitle: "Декларативный UI вместо императивного DOM (React.dev)",
        url: "https://react.dev/learn/reacting-to-input-with-state",
      },
      {
        title: "Кастомные хуки в React",
        urlTitle: "Переиспользование логики с хуками (React.dev)",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
      {
        title: "Очистка эффектов и таймеров",
        urlTitle: "Функция очистки в useEffect (Doka.guide)",
        url: "https://doka.guide/js/react-use-effect/#ochistka-effekta",
      },
      {
        title: "Хранение ссылок без рендера",
        urlTitle: "Хук useRef (Doka.guide)",
        url: "https://doka.guide/js/react-use-ref/",
      },
    ],
    interviewerQuestions: [
      {
        question: "Почему document.querySelector('.timer') внутри useEffect является грубым антипаттерном в React?",
        answer: "React следует декларативной парадигме (UI = f(state)). Прямой поиск в DOM работает в обход Virtual DOM, ломает инкапсуляцию компонентов (если на странице несколько таймеров, изменится только первый) и усложняет тестирование.",
      },
      {
        question: "Как предотвратить утечку памяти при использовании setInterval в React-компоненте?",
        answer: "Обязательно возвращать функцию очистки (cleanup) из useEffect: return () => { clearInterval(intervalRef.current); intervalRef.current = null; }. При размонтировании компонента таймер будет корректно остановлен.",
      },
      {
        question: "Зачем выносить логику секундомера в кастомный хук useTimer()?",
        answer: "Это разделяет ответственность (Single Responsibility Principle): хук управляет состоянием, таймером и действиями (start, pause, stop, toggle), а компонент отвечает исключительно за визуальное представление (JSX).",
      },
      {
        question: "Как реализовать временную анимацию (пульсацию) декларативно без прямого classList.add/remove?",
        answer: "Завести булево состояние isPulsating. При наступлении условия (секунды кратны 5) вызывать setIsPulsating(true) и запускать setTimeout на 600 мс с вызовом setIsPulsating(false), с обязательной очисткой clearTimeout в эффекте.",
      },
    ],
    checklist: [
      "Стили вынесены в отдельный файл App.css",
      "Все функции объявлены как стрелочные (const App = () => { ... })",
      "Прямой вызов document.querySelector('.timer') удалён и заменён на состояние isPulsating",
      "Анимация pulsate включается через состояние и автоматически сбрасывается через setTimeout с clearTimeout",
      "useRef используется для хранения идентификатора интервала без лишних перерендеров",
      "Интервал гарантированно очищается при размонтировании (cleanup в useEffect)",
      "Логика секундомера вынесена в кастомный хук useTimer() (SRP)",
      "Время отформатировано в привычный вид мм:сс с помощью padStart(2, '0')",
    ],
  },
  {
    id: "r17",
    title: "17. Рефакторинг (Company X)",
    desc: "Исправьте проблемы в приложении генератора случайных чисел: почините раскрытие списка при переключении видимости, устраните потерю остановки таймера, предотвратите сброс данных при повторном монтировании, реализуйте удаление элементов и улучшите архитектуру приложения.",
    isMultiFile: true,
    candidate: RefactoringCandidate17,
    rawCandidate: `// App.jsx\n${RefactoringCandidate17_App}\n\n// Buttons.jsx\n${RefactoringCandidate17_Buttons}\n\n// List.jsx\n${RefactoringCandidate17_List}`,
    solution: RefactoringSolution17,
    rawSolution: `// App.jsx\n${RefactoringSolution17_App}\n\n// Buttons.jsx\n${RefactoringSolution17_Buttons}\n\n// List.jsx\n${RefactoringSolution17_List}`,
    filepath: "src/react/tasks/2_refactoring/17_RandomNumberGenerator/App.jsx",
    files: [
      {
        name: "App.jsx",
        filepath: "src/react/tasks/2_refactoring/17_RandomNumberGenerator/App.jsx",
        candidateCode: RefactoringCandidate17_App,
        solutionCode: RefactoringSolution17_App,
      },
      {
        name: "Buttons.jsx",
        filepath: "src/react/tasks/2_refactoring/17_RandomNumberGenerator/Buttons.jsx",
        candidateCode: RefactoringCandidate17_Buttons,
        solutionCode: RefactoringSolution17_Buttons,
      },
      {
        name: "List.jsx",
        filepath: "src/react/tasks/2_refactoring/17_RandomNumberGenerator/List.jsx",
        candidateCode: RefactoringCandidate17_List,
        solutionCode: RefactoringSolution17_List,
      },
    ],
    articles: [
      {
        title: "Хранение значений в refs",
        urlTitle: "Документация useRef (React.dev)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
      {
        title: "Подъем состояния (Lifting State Up)",
        urlTitle: "Разделение состояния между компонентами (React.dev)",
        url: "https://react.dev/learn/sharing-state-between-components",
      },
      {
        title: "Рендеринг списков и ключи",
        urlTitle: "Ключи в коллекциях JSX (React.dev)",
        url: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
      },
      {
        title: "Очистка эффектов и таймеров",
        urlTitle: "Функция очистки в useEffect (Doka.guide)",
        url: "https://doka.guide/js/react-use-effect/#ochistka-effekta",
      },
      {
        title: "Хук useState и обновление состояния",
        urlTitle: "Работа с состоянием (Doka.guide)",
        url: "https://doka.guide/js/react-use-state/",
      },
    ],
    interviewerQuestions: [
      {
        question: "Почему при вызове setVisibleList(visibleList) список не скрывается и не раскрывается?",
        answer:
          "React выполняет проверку состояния через Object.is(prevState, nextState). Передача того же значения не регистрирует изменение, и React пропускает повторный рендер (bailout). Для корректной инверсии необходимо передавать сеттеру функцию: setVisibleList(prev => !prev).",
      },
      {
        question: "Почему хранение ID таймера в локальной переменной let timer = null не позволяет остановить интервал кнопкой «Стоп»?",
        answer:
          "При каждом рендере функционального компонента его тело выполняется заново, пересоздавая локальные переменные с начальными значениями. После первого тика интервала вызов setNumbers приводит к перерендеру, где timer снова становится null. Вызов clearInterval(timer) в stop() пытается очистить null, а запущенный в фоновом потоке интервал продолжает работать. Решение — использовать useRef (timerRef.current), переживающий рендеры.",
      },
      {
        question: "Почему при условном рендеринге {visibleList && <List />} скрытие и повторный показ сбрасывают состояние списка к [1, 2, 3]?",
        answer:
          "Когда условие становится false, React полностью размонтирует (unmount) компонент List и уничтожает его локальный useState. При повторном рендере List создаётся заново с начальным значением [1, 2, 3]. Чтобы данные сохранялись, состояние необходимо поднять в родительский компонент App (Lifting State Up).",
      },
      {
        question: "В чём опасность использования key={`${index}_${num}`} в списках с динамическим удалением элементов?",
        answer:
          "При удалении элемента из середины списка индексы всех последующих элементов сдвигаются. Если ключи завязаны на index, React ошибочно сопоставит старые DOM-узлы и их внутреннее состояние с новыми элементами. Для стабильной идентификации следует генерировать постоянный уникальный id (например, через счётчик nextId.current++ или crypto.randomUUID()) и хранить его в объекте элемента { id, value }.",
      },
      {
        question: "Зачем возвращать функцию очистки с clearInterval из useEffect в компоненте с таймером?",
        answer:
          "Если компонент размонтируется при работающем интервале, функция без очистки продолжит вызываться в фоновом потоке браузера, вызывая утечку памяти (memory leak) и ошибки попытки вызова setState на размонтированном компоненте.",
      },
    ],
    checklist: [
      "Исправлен toggle видимости: используется функциональное обновление setVisibleList(prev => !prev)",
      "ID таймера хранится в useRef (timerRef.current) вместо локальной переменной",
      "Флаг активности таймера started вынесен в useState для реактивного управления кнопками",
      "Добавлена очистка интервала clearInterval в useEffect при размонтировании",
      "Состояние списка numbers поднято в родительский компонент App (Lifting State Up)",
      "Реализовано удаление элементов по уникальному идентификатору (removeNumber)",
      "Элементы списка используют уникальные стабильные ключи (key={item.id})",
      "Кнопки имеют корректные disabled-состояния (Старт блокируется при работе, Стоп — при простое)",
      "Генерация случайного числа исправлена на Math.floor(Math.random() * 10) + 1",
      "Обработчики событий в App мемоизированы через useCallback",
    ],
  },
];

export const MAIN_TASKS = [
  {
    id: 5,
    title: "1. Персонажи Рик и Морти (Middle)",
    desc: "Асинхронный поиск по имени и фильтрация по статусу (alive, dead, unknown) с Rick and Morty API. Оптимизация запросов, обработка состояний загрузки/ошибок и предотвращение race conditions.",
    candidate: Candidate1,
    rawCandidate: Candidate1Raw,
    solution: Solution1,
    rawSolution: Solution1Raw,
    filepath: "src/react/tasks/3_ui_patterns/1_FetchPersons.jsx",
    articles: [
      {
        title: "State Machine и состояния в React",
        urlTitle: "Хук useState и состояние (Doka.guide)",
        url: "https://doka.guide/js/react-use-state/",
      },
      {
        title: "Динамические query-параметры (URLSearchParams)",
        urlTitle: "Объект URL и URLSearchParams (LearnJS)",
        url: "https://learn.javascript.ru/url#urlsearchparams",
      },
      {
        title: "Отмена асинхронных операций (AbortController)",
        urlTitle: "Отмена асинхронных запросов в fetch (Doka.guide)",
        url: "https://doka.guide/js/fetch/#otmena-zaprosa",
      },
      {
        title: "Защита от Race Condition в эффектах",
        urlTitle: "Синхронизация эффектов и отмена (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
      },
      {
        title: "Обработка ошибок Fetch API и res.ok",
        urlTitle: "Сеть: Fetch и обработка ошибок (LearnJS)",
        url: "https://learn.javascript.ru/fetch",
      },
      {
        title: "Формы и обработка ввода (onChange)",
        urlTitle: "Работа с формами в React (Doka.guide)",
        url: "https://doka.guide/js/react-forms/",
      },
      {
        title: "Оптимизация ввода (Debounce)",
        urlTitle: "Дебаунс функций при поиске (LearnJS)",
        url: "https://learn.javascript.ru/task/debounce",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как отловить ошибку 404 при поиске несуществующего персонажа в API Rick & Morty?",
        answer:
          'Рик и Морти API при отсутствии результата возвращает статус 404 с объектом { error: "There is nothing here" }. Метод fetch не падаёт в catch на 404, поэтому нужно проверить !res.ok и распарсить тело ответа для показа ошибки.',
      },
      {
        question:
          "Для чего используется new URLSearchParams() в этой задаче: для HTTP-запроса или для изменения адресной строки браузера?",
        answer:
          "Исключительно для формирования query-строки сетевого fetch-запроса к API (rickandmortyapi.com/api/character?...). Сам по себе new URLSearchParams() адресную строку браузера не меняет — он лишь формирует и экранирует строку параметров в памяти JS. Для изменения URL в адресной строке браузера требуется обращение к History API (window.history.replaceState или pushState), как это делается в задаче на синхронизацию фильтров с URL.",
      },
    ],
    checklist: [
      "Реализована защита от Race Condition (флаг ignore или AbortController)",
      "Обработаны все состояния: loading, error, пустой результат, данные",
      "API-ошибка 404 обрабатывается через проверку !res.ok",
      "Фильтрация по статусу (alive/dead/unknown) работает совместно с поиском",
      "Синхронизация фильтров с URL: чтение при старте, history.replaceState при изменении и подписка на popstate",
    ],
  },
  {
    id: 51,
    title: "2. Персонажи Рик и Морти (Middle+)",
    desc: "Добавьте в компонент отмену спама запросов при печати (Debounce) с помощью кастомного хука useDebounce.",
    candidate: Candidate2,
    rawCandidate: Candidate2Raw,
    solution: Solution2,
    rawSolution: Solution2Raw,
    filepath: "src/react/tasks/3_ui_patterns/2_FetchPersonsDebounce.jsx",
    articles: [
      {
        title: "Оптимизация ввода (Debounce)",
        urlTitle: "Дебаунс функций при поиске (LearnJS)",
        url: "https://learn.javascript.ru/task/debounce",
      },
      {
        title: "Отмена асинхронных операций (AbortController)",
        urlTitle: "Отмена асинхронных запросов в fetch (Doka.guide)",
        url: "https://doka.guide/js/fetch/#otmena-zaprosa",
      },
      {
        title: "Защита от Race Condition в эффектах",
        urlTitle: "Синхронизация эффектов и отмена (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
      },
    ],
    interviewerQuestions: [
      {
        question: "Зачем нужен Debounce при поисковом вводе?",
        answer:
          "Debounce откладывает вызов сетевого запроса на заданный интервал (например 300 мс) после последнего нажатия клавиши. Это предотвращает отправку сетевых запросов на каждый вводимый символ и разгружает сервер.",
      },
    ],
    checklist: [
      "Реализован или подключён кастомный хук useDebounce",
      "Сетевой эффект завязан на debounced-значение переменной поиска",
      "Ввод текста в инпут остаётся мгновенным и отзывчивым",
      "Синхронизация фильтров с URL: чтение при старте, history.replaceState при изменении и подписка на popstate",
    ],
  },
  {
    id: 52,
    title: "3. Персонажи Рик и Морти (Senior)",
    desc: "Добавьте к решению с Debounce кэширование результатов сетевых запросов с помощью Map для исключения повторных вызовов API при одинаковых фильтрах.",
    candidate: Candidate3,
    rawCandidate: Candidate3Raw,
    solution: Solution3,
    rawSolution: Solution3Raw,
    filepath: "src/react/tasks/3_ui_patterns/3_FetchPersonsCache.jsx",
    articles: [
      {
        title: "Кэширование с Map",
        urlTitle: "Коллекция Map (LearnJS)",
        url: "https://learn.javascript.ru/map-set",
      },
      {
        title: "Оптимизация ввода (Debounce)",
        urlTitle: "Дебаунс функций при поиске (LearnJS)",
        url: "https://learn.javascript.ru/task/debounce",
      },
      {
        title: "Отмена асинхронных операций (AbortController)",
        urlTitle: "Отмена асинхронных запросов в fetch (Doka.guide)",
        url: "https://doka.guide/js/fetch/#otmena-zaprosa",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "В чем разница между выносом Map вне компонента и использованием useRef(new Map())?",
        answer:
          "Map вне компонента (в module scope) живет на протяжении всей сессии приложения и сохраняет кэш даже при размонтировании и повторном монтировании компонента. useRef(new Map()) привязан к жизненному циклу конкретного инстанса компонента и очищается при его отмонтировании.",
      },
      {
        question:
          "Почему URLSearchParams.toString() идеально подходит в качестве ключа кэша (cacheKey) для Map?",
        answer:
          "Метод params.toString() формирует стандартизированную сериализованную строку параметров вида 'name=rick&status=alive'. В отличие от ручной конкатенации строк, это исключает коллизии ключей при разных комбинациях полей и гарантирует однозначный детерминированный строковый ключ для поиска в Map.get(cacheKey).",
      },
    ],
    checklist: [
      "Реализовано кэширование результатов запроса через Map по ключу query-параметров",
      "При повторном поиске с теми же параметрами данные берутся из Map без вызова fetch",
      "Кэш хранится корректно вне рендеров компонента",
      "Синхронизация фильтров с URL: чтение при старте, history.replaceState при изменении и подписка на popstate",
    ],
  },
  {
    id: 8,
    title: "4. Работа с массивами без мутаций",
    desc: "Реализуйте компонент списка задач с иммутабельным добавлением новых элементов без мутации состояния.",
    candidate: Candidate4,
    rawCandidate: Candidate4Raw,
    solution: Solution4,
    rawSolution: Solution4Raw,
    filepath: "src/react/tasks/3_ui_patterns/4_ArrayNoMutation.jsx",
    articles: [
      {
        title: "Иммутабельность массивов",
        urlTitle: "Обновление массивов в состоянии (React.dev)",
        url: "https://react.dev/learn/updating-arrays-in-state",
      },
      {
        title: "Оператор Spread",
        urlTitle: "Работа с массивами (LearnJS)",
        url: "https://learn.javascript.ru/array-methods",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему метода arr.push() недостаточно для добавления элемента в стейт React?",
        answer:
          "Метод push() мутирует текущий массив по ссылке в памяти без изменения адреса самого массива. Сравнение стейтов в React (Object.is) посчитает массив неизменившимся и отменит перерисовку.",
      },
    ],
    checklist: [
      "Новый элемент добавляется через spread: [...prev, newItem]",
      "Не используются мутирующие методы: push(), splice(), sort() на стейте",
      "Каждый элемент списка имеет уникальный идентификатор (не индекс)",
      "Понимание: push() мутирует массив по ссылке, React не видит изменения",
    ],
  },
  {
    id: 6,
    title: "5. Todo List",
    desc: "Базовый трекер задач: добавление без пустых строк, удаление по клику и зачеркивание при выполнении.",
    candidate: Candidate5,
    rawCandidate: Candidate5Raw,
    solution: Solution5,
    rawSolution: Solution5Raw,
    filepath: "src/react/tasks/3_ui_patterns/5_TodoList.jsx",
    articles: [
      {
        title: "Ключи key в списках",
        urlTitle: "Списки и ключи key (React.dev)",
        url: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
      },
      {
        title: "Ключи элементов",
        urlTitle: "Ключи key в React (Doka.guide)",
        url: "https://doka.guide/js/react-keys/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему при генерации элементов Todo-списка нельзя использовать индекс массива в качестве пропса key={index}?",
        answer:
          "При удалении или перестановке элементов индексы смещаются. React связывает внутренний состояние DOM-узлов (например фокус, значение поля ввода) с ключами, что приведёт к отображению устаревших данных не у того элемента.",
      },
    ],
    checklist: [
      "Валидация: пустая строка не добавляется в список (trim() проверка)",
      "Удаление элемента через .filter(item => item.id !== targetId)",
      "Переключение статуса через .map() с иммутабельным обновлением объекта",
      "Каждый todo имеет уникальный key (id), а не индекс массива",
    ],
  },
  {
    id: 9,
    title: "6. Todo List (Company X)",
    desc: "Реализуйте Todo-приложение со списками дел на Сегодня и Завтра в едином объекте состояния, включая добавление и удаление последней задачи.",
    candidate: Candidate6,
    rawCandidate: Candidate6Raw,
    solution: Solution6,
    rawSolution: Solution6Raw,
    filepath: "src/react/tasks/3_ui_patterns/6_TodoListCompanyX.jsx",
    articles: [
      {
        title: "Вложенные объекты",
        urlTitle: "Обновление объектов в стейте (React.dev)",
        url: "https://react.dev/learn/updating-objects-in-state",
      },
      {
        title: "Сложный стейт",
        urlTitle: "Обновление вложенных объектов (Doka.guide)",
        url: "https://doka.guide/js/react-use-state/#obnovlenie-obektov",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как корректно обновить вложенный список задач объекта состояния { today: [...], tomorrow: [...] }?",
        answer:
          "Необходимо применить поверхностное копирование внешнего объекта через spread-оператор и создать новую копию целевого массива: { ...state, today: [...state.today, newTask] }.",
      },
    ],
    checklist: [
      "Вложенный объект состояния обновляется иммутабельно: { ...state, today: [...state.today, newTask] }",
      "Удаление последней задачи: .slice(0, -1) без мутации исходного массива",
      "Два списка (Сегодня и Завтра) управляются единым объектом состояния",
      "Spread копирует внешний объект и целевой массив при каждом обновлении",
    ],
  },
  {
    id: 10,
    title: "7. Работа с изображением (Company X)",
    desc: "Реализуйте компонент RefetchImage: повторная загрузка изображения по клику через fetch с корректным управлением памятью и освобождением ресурсов.",
    candidate: Candidate7,
    rawCandidate: Candidate7Raw,
    solution: Solution7,
    rawSolution: Solution7Raw,
    filepath: "src/react/tasks/3_ui_patterns/7_RefetchImage.jsx",
    articles: [
      {
        title: "Объекты Blob в JS",
        urlTitle: "Объекты Blob и создаваемые URL (LearnJS)",
        url: "https://learn.javascript.ru/blob",
      },
      {
        title: "Управление памятью",
        urlTitle: "Освобождение памяти с revokeObjectURL (Doka.guide)",
        url: "https://doka.guide/js/blob/",
      },
    ],
    interviewerQuestions: [
      {
        question: "Зачем необходим вызов URL.revokeObjectURL(oldUrl)?",
        answer:
          "Создаваемые через URL.createObjectURL(blob) ссылки удерживают изображение в оперативной памяти браузера. Если не освобождать старые Blob-ссылки через revokeObjectURL, происходит утечка памяти.",
      },
    ],
    checklist: [
      "Blob-URL создаётся через URL.createObjectURL(blob)",
      "Старый Blob-URL освобождается через URL.revokeObjectURL(oldUrl)",
      "Функция очистки useEffect вызывает revokeObjectURL при размонтировании",
      "Изображение загружается через fetch(src) → res.blob() → createObjectURL",
    ],
  },
  {
    id: 11,
    title: "8. Работа с постами (Company X)",
    desc: "Реализуйте компонент PostsManager: загрузка первых 5 постов по URL, индикаторы загрузки/ошибки, локальное добавление постов в начало с пометкой (локальный) и удаление постов.",
    candidate: Candidate8,
    rawCandidate: Candidate8Raw,
    solution: Solution8,
    rawSolution: Solution8Raw,
    filepath: "src/react/tasks/3_ui_patterns/8_PostsManager.jsx",
    articles: [
      {
        title: "Управление массивами",
        urlTitle: "Обновление массивов в состоянии (React.dev)",
        url: "https://react.dev/learn/updating-arrays-in-state",
      },
      {
        title: "Слайсинг массивов",
        urlTitle: "Метод slice у массивов (LearnJS)",
        url: "https://learn.javascript.ru/array-methods",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как объединить загруженные посты из API и локально созданные посты пользователя?",
        answer:
          "Локально созданный пост создается как новый объект с уникальным идентификатором (например id: Date.now()) и вставляется в начало объединенного массива [newPost, ...posts].",
      },
    ],
    checklist: [
      "Загрузка первых 5 постов: fetch(url).then().slice(0, 5)",
      "Локальный пост добавляется в начало массива: [newPost, ...posts]",
      "Удаление поста через .filter(post => post.id !== targetId)",
      "Обработаны состояния loading и error при загрузке данных",
    ],
  },
  {
    id: 12,
    title: "9. Работа с паролем (Company X)",
    desc: "Реализуйте поле ввода пароля с возможностью временно показать текст. При показе пароля запускается авто-скрытие по таймеру hideTimeoutMs. Таймер перезапускается при вводе и сбрасывается при размонтировании.",
    candidate: Candidate9,
    rawCandidate: Candidate9Raw,
    solution: Solution9,
    rawSolution: Solution9Raw,
    filepath: "src/react/tasks/3_ui_patterns/9_PasswordCompanyX.jsx",
    articles: [
      {
        title: "Ссылки на значения",
        urlTitle: "Сохранение значений с refs (React.dev)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
      {
        title: "Таймеры и очистка в useEffect",
        urlTitle: "Очистка эффектов (Doka.guide)",
        url: "https://doka.guide/js/react-use-effect/#ochistka-pobochnyh-effektov",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему ссылки на таймер (timerRef.current = setTimeout(...)) сохраняют в useRef, а не в useState?",
        answer:
          "useRef позволяет сохранять мутабельное значение таймера между рендерами без вызова повторной перерисовки компонента при его изменении.",
      },
      {
        question:
          "Зачем добавлять password в массив зависимостей useEffect при автоскрытии?",
        answer:
          "Включение password в зависимости приводит к повторному вызову эффекта при вводе каждого нового символа. Благодаря функции очистки (return () => clearTimeout) предыдущий таймер сбрасывается и стартует заново.",
      },
    ],
    checklist: [
      "ID таймера хранится в useRef, а не в useState",
      "Таймер автоскрытия перезапускается при каждом вводе символа",
      "Таймер очищается через clearTimeout в функции очистки useEffect",
      "Тип инпута переключается между 'password' и 'text' через состояние",
    ],
  },
  {
    id: 13,
    title: "10. Синхронизация фильтров с URL (Company X)",
    desc: "Реализуйте каталог товаров с фильтрацией (поиск, категория, наличие, сортировка) и полной двусторонней синхронизацией состояния с адресной строкой и навигацией браузера.",
    candidate: Candidate10,
    rawCandidate: Candidate10Raw,
    solution: Solution10,
    rawSolution: Solution10Raw,
    filepath: "src/react/tasks/3_ui_patterns/10_UrlSearchParamsFilter.jsx",
    articles: [
      {
        title: "Объект URLSearchParams (MDN)",
        urlTitle: "MDN Web Docs — URLSearchParams",
        url: "https://developer.mozilla.org/ru/docs/Web/API/URLSearchParams",
      },
      {
        title: "URL и URLSearchParams (LearnJS)",
        urlTitle: "Объект URL и URLSearchParams (LearnJS)",
        url: "https://learn.javascript.ru/url#urlsearchparams",
      },
      {
        title: "Синхронизация эффектов (React.dev)",
        urlTitle: "Synchronizing with Effects (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects",
      },
      {
        title: "History API и событие popstate",
        urlTitle: "Работа с History API в браузере (Doka.guide)",
        url: "https://doka.guide/js/history-api/",
      },
      {
        title: "Хук useSearchParams в React Router",
        urlTitle: "React Router — useSearchParams Docs",
        url: "https://reactrouter.com/en/main/hooks/use-search-params",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему поиск и фильтры в реальных приложениях (e.g. e-commerce) рекомендуется хранить в URLSearchParams, а не только во внутреннем useState компонента?",
        answer:
          "Хранение состояния в URL решает три ключевые задачи: 1) Сохраняемость состояния (state persistence) при обновлении страницы пользователем (F5); 2) Возможность поделиться ссылкой (shareable URLs) — коллега или друг откроет ту же страницу с примененными фильтрами; 3) Корректная работа истории браузера и кнопок «Назад» / «Вперёд».",
      },
      {
        question:
          "В чем заключается ловушка булевых параметров (например inStock / isActive) при работе с URLSearchParams?",
        answer:
          "Все значения в URLSearchParams всегда являются строками. Если параметр записан как inStock=false, метод params.get('inStock') вернет непустую строку 'false'. В JavaScript выражение Boolean('false') равно true! Поэтому правильная проверка должна явно сравнивать значение со строкой: params.get('inStock') === 'true'.",
      },
      {
        question:
          "Зачем удалять параметры из URLSearchParams (params.delete), когда значение фильтра совпадает со значением по умолчанию?",
        answer:
          "Это предотвращает замусоривание адресной строки (clean URLs). Строка вида ?query=&category=all&inStock=false&sort=none ухудшает читаемость, увеличивает размер URL, мешает SEO-индексации и может вызывать ложные срабатывания фильтров на бэкенде, если бэкенд проверяет наличие ключа в query params.",
      },
      {
        question:
          "В чем разница между history.pushState и history.replaceState, и что лучше использовать при фильтрации и поиске?",
        answer:
          "pushState добавляет новую запись в историю переходов браузера, а replaceState заменяет текущую запись. При наборе текста в поле поиска или переключении чекбоксов фильтров добавление каждой правки в историю перегрузит её (пользователю придется 30 раз нажать кнопку «Назад», чтобы вернуться на предыдущую страницу). Поэтому при вводе в поиске и уточнении фильтров используется replaceState (часто в связке с Debounce), а pushState применяется при переходе на новую страницу или кардинальной смене раздела.",
      },
      {
        question:
          "Зачем подписываться на событие 'popstate' при работе с URLSearchParams без сторонних роутеров?",
        answer:
          "Методы history.pushState и history.replaceState не вызывают событие popstate самостоятельно. Однако когда пользователь нажимает кнопки браузера «Назад» или «Вперёд», браузер инициирует событие popstate. Подписка window.addEventListener('popstate', handler) позволяет React-компоненту вовремя считать новый window.location.search и синхронизировать состояние фильтров в интерфейсе.",
      },
    ],
    checklist: [
      "Начальное состояние фильтров считывается из window.location.search через URLSearchParams",
      "Булево значение (inStock) корректно десериализуется из строки: get('inStock') === 'true'",
      "При изменении фильтров параметры обновляются в URL через window.history.replaceState",
      "Дефолтные и пустые параметры удаляются из URLSearchParams через params.delete()",
      "Присутствует подписка на событие 'popstate' с корректной очисткой при анмаунте (removeEventListener)",
      "Список товаров корректно фильтруется по поисковой строке, категории, наличию и сортируется по цене",
    ],
  },
  {
    id: 14,
    title: "11. Автокомплит с клавиатурой (Company X)",
    desc: "Реализация доступного поля ввода с выпадающим списком подсказок (Combobox / Autocomplete), навигацией стрелками клавиатуры, выбором по Enter и управлением фокусом.",
    candidate: Candidate11,
    rawCandidate: Candidate11Raw,
    solution: Solution11,
    rawSolution: Solution11Raw,
    filepath: "src/react/tasks/3_ui_patterns/11_AutocompleteCombobox.jsx",
    articles: [
      {
        title: "Паттерн Combobox (W3C WAI-ARIA)",
        urlTitle: "ARIA Authoring Practices Guide — Combobox",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
      },
      {
        title: "События клавиатуры в React",
        urlTitle: "Клавиатурные события (Doka.guide)",
        url: "https://doka.guide/js/keyboard-events/",
      },
      {
        title: "Мемоизация вычислений (useMemo)",
        urlTitle: "Хук useMemo (React.dev)",
        url: "https://react.dev/reference/react/useMemo",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему клик мышью по подсказке в выпадающем списке может не сработать, если на инпуте висит обработчик onBlur?",
        answer:
          "В браузере событие blur на инпуте происходит раньше, чем событие click на элементе списка. При blur список немедленно скрывается из DOM, и клик просто не успевает зарегистрироваться. Чтобы это исправить, на элементах подсказок слушают onMouseDown с вызовом e.preventDefault() (что предотвращает потерю фокуса инпутом до выбора) либо обрабатывают клик прямо в onMouseDown.",
      },
      {
        question:
          "Зачем нужен e.preventDefault() при обработке клавиш ArrowDown и ArrowUp в инпуте?",
        answer:
          "По умолчанию стрелки вверх и вниз в текстовом поле перемещают каретку в начало или конец текста, либо прокручивают страницу. Вызов e.preventDefault() отменяет нативное поведение браузера и позволяет использовать клавиши строго для навигации по списку подсказок.",
      },
      {
        question:
          "Как правильно реализовать зацикливание при клавиатурной навигации по списку?",
        answer:
          "С помощью остатка от деления: для перехода вниз (prevIndex + 1) % items.length, а для перехода вверх (prevIndex - 1 + items.length) % items.length. Это гарантирует бесшовный переход от последнего элемента к первому и наоборот.",
      },
    ],
    checklist: [
      "При вводе текста подсказки фильтруются без учета регистра",
      "При пустом поле ввода выпадающий список скрыт",
      "Клавиши ArrowDown и ArrowUp циклично перемещают активный элемент",
      "Клавиша Enter выбирает подсвеченную подсказку и закрывает список",
      "Клавиша Escape закрывает выпадающий список",
      "Выбор мышью работает корректно и не блокируется потерей фокуса (onBlur)",
      "Использованы атрибуты доступности role='combobox', role='listbox', role='option', aria-selected",
    ],
  },
  {
    id: 15,
    title: "12. Оптимистичные обновления (Company X)",
    desc: "Реализация паттерна Optimistic UI: мгновенное изменение состояния интерфейса, вызов асинхронной мутации и автоматический откат (Rollback) при серверной ошибке.",
    candidate: Candidate12,
    rawCandidate: Candidate12Raw,
    solution: Solution12,
    rawSolution: Solution12Raw,
    filepath: "src/react/tasks/3_ui_patterns/12_OptimisticLike.jsx",
    articles: [
      {
        title: "Оптимистичные обновления в UI",
        urlTitle: "Паттерн Optimistic UI (Doka.guide)",
        url: "https://doka.guide/js/deal-with-errors/",
      },
      {
        title: "Обработка ошибок асинхронных операций",
        urlTitle: "Async/Await и try/catch (LearnJS)",
        url: "https://learn.javascript.ru/async-await",
      },
      {
        title: "Предотвращение Race Conditions в React",
        urlTitle: "State as a Snapshot (React.dev)",
        url: "https://react.dev/learn/state-as-a-snapshot",
      },
    ],
    interviewerQuestions: [
      {
        question: "В чем фундаментальная разница между пессимистичным и оптимистичным обновлением UI?",
        answer:
          "При пессимистичном обновлении UI показывает спиннер и ждет подтверждения от сервера, прежде чем обновить интерфейс. При оптимистичном UI немедленно отображает целевое состояние (будто запрос уже успешен), обеспечивая мгновенный отклик приложения. Однако оптимистичный подход требует обязательной реализации механизма отката (rollback) в случае сетевого сбоя.",
      },
      {
        question: "Как правильно организовать Rollback при падении запроса?",
        answer:
          "Перед мутацией стейта сохраняется снимок (snapshot) текущего состояния в локальные переменные. В блоке catch эти сохраненные значения передаются в setState, возвращая интерфейс к исходному виду, а пользователю выводится понятное сообщение об ошибке.",
      },
      {
        question: "Как предотвратить race condition при частых кликах по оптимистичной кнопке?",
        answer:
          "Самый надежный способ во время live-coding — блокировать кнопку (disabled={isLoading}) на время полета сетевого запроса. В сложных продакшен-архитектурах используют очередь запросов (action queue) или отмену предыдущего запроса через AbortController с корректным мержем снимков.",
      },
    ],
    checklist: [
      "При клике на кнопку счетчик и статус обновляются мгновенно без ожидания сервера",
      "Перед мутацией сохраняется снимок предыдущего состояния",
      "При ошибке сервера (reject) состояние откатывается к исходным значениям",
      "Пользователю отображается текст ошибки при откате",
      "Кнопка блокируется на время выполнения запроса",
    ],
  },
  {
    id: 16,
    title: "13. Корзина товаров и скидки (Company X)",
    desc: "Реализация корзины интернет-магазина с промокодами, расчетом скидок и стоимости доставки через производное состояние без лишних синхронизирующих эффектов.",
    candidate: Candidate13,
    rawCandidate: Candidate13Raw,
    solution: Solution13,
    rawSolution: Solution13Raw,
    filepath: "src/react/tasks/3_ui_patterns/13_ShoppingCart.jsx",
    articles: [
      {
        title: "Вам может не понадобиться Effect (React.dev)",
        urlTitle: "You Might Not Need an Effect (React.dev)",
        url: "https://react.dev/learn/you-might-not-need-an-effect",
      },
      {
        title: "Иммутабельное обновление массивов в стейте",
        urlTitle: "Updating Arrays in State (React.dev)",
        url: "https://react.dev/learn/updating-arrays-in-state",
      },
      {
        title: "Метод Array.prototype.reduce",
        urlTitle: "Метод reduce в JavaScript (LearnJS)",
        url: "https://learn.javascript.ru/array-methods#reduce-reduceright",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему хранение totalPrice и discount в отдельных useState и их пересчет в useEffect([items]) считается грубой ошибкой?",
        answer:
          "Это классический антипаттерн «эффект-синхронизатор». Он приводит к каскадным рендерам (компонент рендерится с устаревшей суммой, затем эффект вызывает setState и запускается второй рендер), увеличивает риск рассинхронизации данных и усложняет тестирование. Любые значения, которые можно рассчитать на основе уже имеющегося стейта или пропсов, должны вычисляться прямо во время рендера.",
      },
      {
        question:
          "Как правильно обновлять количество товара в корзине без мутации оригинального массива?",
        answer:
          "Через метод items.map(item => item.id === targetId ? { ...item, quantity: newQty } : item). Это создает новый массив и новый объект для измененной позиции, сохраняя ссылки на неизмененные элементы.",
      },
    ],
    checklist: [
      "Товары отображаются со своими ценами, количеством и остатком",
      "Кнопка '-' блокируется при количестве 1",
      "Кнопка '+' блокируется при достижении максимального остатка maxStock",
      "Удаление товара корректно убирает его из списка",
      "Промокоды SAVE10 и SALE500 применяются по правилам и могут быть отменены",
      "Стоимость доставки, скидка и итоговая сумма вычисляются прямо во время рендера без useEffect",
    ],
  },
  {
    id: 17,
    title: "14. Аккордеон: Compound Components (Company X)",
    desc: "Проектирование составного компонента (Compound Components) с координацией состояния через React Context, поддержкой режимов single/multiple и WAI-ARIA.",
    candidate: Candidate14,
    rawCandidate: Candidate14Raw,
    solution: Solution14,
    rawSolution: Solution14Raw,
    filepath: "src/react/tasks/3_ui_patterns/14_CompoundAccordion.jsx",
    articles: [
      {
        title: "Паттерн Compound Components в React",
        urlTitle: "Compound Components Pattern (Kent C. Dodds)",
        url: "https://kentcdodds.com/blog/compound-components-with-react-hooks",
      },
      {
        title: "Хук useContext и контекст React",
        urlTitle: "Passing Data Deeply with Context (React.dev)",
        url: "https://react.dev/learn/passing-data-deeply-with-context",
      },
      {
        title: "Доступность аккордеонов (W3C ARIA)",
        urlTitle: "ARIA Authoring Practices Guide — Accordion",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
      },
    ],
    interviewerQuestions: [
      {
        question: "В чем преимущества паттерна Compound Components перед передачей массива объектов в пропсы (например items={[...]} )?",
        answer:
          "Гибкость композиции. Потребитель компонента не ограничен жестким шаблоном: он может вставлять между элементами кастомные заголовки, разделители, иконки, настраивать структуру вёрстки. Компоненты общаются неявно через Context, избавляя от prop drilling.",
      },
      {
        question: "Зачем выбрасывать исключение, если useContext возвращает null в подкомпоненте?",
        answer:
          "Это паттерн защитного программирования (Fail Fast). Если разработчик случайно отрендерит Accordion.Item вне Accordion, он моментально получит понятную ошибку в консоли («Accordion.Item должен использоваться внутри Accordion»), а не загадочный TypeError undefined при попытке вызвать функцию контекста.",
      },
    ],
    checklist: [
      "Компоненты Accordion.Item, Accordion.Header и Accordion.Body экспортируются как статические свойства Accordion",
      "Состояние открытых секций управляется через Context без prop drilling",
      "Поддерживается флаг allowMultiple (одиночный и множественный выбор)",
      "Кнопка заголовка содержит корректный атрибут aria-expanded",
      "Присутствует валидация наличия контекста в подкомпонентах",
    ],
  },
  {
    id: 18,
    title: "15. Секундомер с кругами (Company X)",
    desc: "Реализация высокоточного секундомера с фиксацией кругов (Lap Times), защитой от дрейфа таймера в Event Loop и обязательной очисткой ресурсов.",
    candidate: Candidate15,
    rawCandidate: Candidate15Raw,
    solution: Solution15,
    rawSolution: Solution15Raw,
    filepath: "src/react/tasks/3_ui_patterns/15_StopwatchLaps.jsx",
    articles: [
      {
        title: "Таймеры в JavaScript и Event Loop",
        urlTitle: "Таймеры: setTimeout и setInterval (LearnJS)",
        url: "https://learn.javascript.ru/settimeout-setinterval",
      },
      {
        title: "Хранение значений без рендеров (useRef)",
        urlTitle: "Referencing Values with Refs (React.dev)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
      {
        title: "Очистка побочных эффектов (useEffect)",
        urlTitle: "Synchronizing with Effects (React.dev)",
        url: "https://react.dev/learn/synchronizing-with-effects",
      },
    ],
    interviewerQuestions: [
      {
        question: "Почему setInterval(() => setTime(t => t + 10), 10) накапливает ошибку (дрейф таймера)?",
        answer:
          "В JavaScript интервалы и таймауты выполняются в очереди макротасок Event Loop. Если поток выполнения занят другими вычислениями или рендером, выполнение колбэка откладывается. Задержки суммируются, и за несколько минут часы могут отстать на секунды. Правильный подход — рассчитывать прошедшее время как разницу системных меток Date.now() - startTimeRef.current.",
      },
      {
        question: "Почему startTime и intervalId лучше хранить в useRef, а не в useState?",
        answer:
          "Изменение значений в useRef не инициирует повторный рендер компонента. Запись intervalId в useState вызвала бы лишний рендер сразу после нажатия кнопки «Старт», что бессмысленно, так как интерфейс зависит только от отображаемого времени и флага активности секундомера.",
      },
      {
        question: "Зачем нужна очистка таймера в useEffect при размонтировании?",
        answer:
          "Если пользователь запустит секундомер и перейдет на другую страницу, активный setInterval останется в памяти браузера. Он продолжит вызываться каждые 16 мс и пытаться вызвать setState на размонтированном компоненте, вызывая утечку памяти (memory leak).",
      },
    ],
    checklist: [
      "Время отображается в формате MM:SS.ms (минуты, секунды, сотые доли)",
      "Расчет времени использует разницу меток Date.now() для защиты от дрейфа",
      "Кнопки Старт / Пауза корректно возобновляют и приостанавливают отсчет",
      "Кнопка 'Круг' фиксирует время и сплит каждого круга в список",
      "Кнопка 'Сброс' останавливает таймер, обнуляет время и очищает круги",
      "Интервал очищается при остановке, сбросе и размонтировании компонента",
    ],
  },
];

export const ADVANCED_TASKS = [
  {
    id: "a1",
    title: "1. Загрузка данных (useReducer)",
    desc: "Реализуйте загрузку пользователей из внешнего API при монтировании с индикацией загрузки и обработкой ошибок, используя useReducer вместо useState.",
    candidate: CandidateAdvanced1,
    rawCandidate: CandidateAdvanced1Raw,
    solution: SolutionAdvanced1,
    rawSolution: `// index.jsx\n${SolutionAdvanced1_Index}\n\n// useFetchUsers.js\n${SolutionAdvanced1_Hook}\n\n// reducer.js\n${SolutionAdvanced1_Reducer}`,
    filepath: "src/react/tasks/4_state_management/1_FetchUsersReducer/index.jsx",
    files: [
      {
        name: "index.jsx",
        filepath: "src/react/tasks/4_state_management/1_FetchUsersReducer/index.jsx",
        candidateCode: CandidateAdvanced1_Index,
        solutionCode: SolutionAdvanced1_Index,
      },
      {
        name: "useFetchUsers.js",
        filepath: "src/react/tasks/4_state_management/1_FetchUsersReducer/useFetchUsers.js",
        candidateCode: CandidateAdvanced1_Hook,
        solutionCode: SolutionAdvanced1_Hook,
      },
      {
        name: "reducer.js",
        filepath: "src/react/tasks/4_state_management/1_FetchUsersReducer/reducer.js",
        candidateCode: CandidateAdvanced1_Reducer,
        solutionCode: SolutionAdvanced1_Reducer,
      },
    ],
    articles: [
      {
        title: "Хук useReducer (React.dev)",
        urlTitle: "Документация useReducer (React.dev)",
        url: "https://react.dev/reference/react/useReducer",
      },
      {
        title: "useReducer в Doka",
        urlTitle: "Хук useReducer (Doka.guide)",
        url: "https://doka.guide/js/react-use-reducer/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "В чем главное архитектурное преимущество useReducer перед несколькими вызовами useState?",
        answer:
          'useReducer объединяет логику переходов состояний в едином чистом reducer. Это исключает противоречивые состояния (например одновременное loading: true и error: "Failed").',
      },
    ],
    checklist: [
      "Состояния loading/error/data управляются единым reducer вместо 3 useState",
      "Reducer — чистая функция без побочных эффектов",
      "Невозможны противоречивые состояния (loading: true + error: 'Failed')",
      "Dispatch вызывается внутри async-функции в useEffect",
    ],
  },
  {
    id: "a2",
    title: "2. Загрузка данных (Redux Toolkit)",
    desc: "Реализуйте загрузку пользователей из внешнего API с помощью createAsyncThunk, настройте store с configureStore и выведите список пользователей, используя useSelector и useDispatch.",
    candidate: CandidateAdvanced2,
    rawCandidate: CandidateAdvanced2Raw,
    solution: SolutionAdvanced2,
    rawSolution: `// index.jsx\n${SolutionAdvanced2_Index}\n\n// usersSlice.js\n${SolutionAdvanced2_Slice}\n\n// store.js\n${SolutionAdvanced2_Store}`,
    filepath: "src/react/tasks/4_state_management/2_FetchUsersRTK/index.jsx",
    files: [
      {
        name: "index.jsx",
        filepath: "src/react/tasks/4_state_management/2_FetchUsersRTK/index.jsx",
        candidateCode: CandidateAdvanced2_Index,
        solutionCode: SolutionAdvanced2_Index,
      },
      {
        name: "usersSlice.js",
        filepath: "src/react/tasks/4_state_management/2_FetchUsersRTK/usersSlice.js",
        candidateCode: CandidateAdvanced2_Slice,
        solutionCode: SolutionAdvanced2_Slice,
      },
      {
        name: "store.js",
        filepath: "src/react/tasks/4_state_management/2_FetchUsersRTK/store.js",
        candidateCode: CandidateAdvanced2_Store,
        solutionCode: SolutionAdvanced2_Store,
      },
    ],
    articles: [
      {
        title: "createAsyncThunk (Redux Toolkit)",
        urlTitle: "Документация createAsyncThunk (Redux Toolkit)",
        url: "https://redux-toolkit.js.org/api/createAsyncThunk",
      },
      {
        title: "Redux Toolkit в Doka",
        urlTitle: "Redux Toolkit и thunks (Doka.guide)",
        url: "https://doka.guide/tools/redux-toolkit/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Какие 3 экшена автоматически создаются при вызове createAsyncThunk?",
        answer:
          "createAsyncThunk автоматизирует асинхронные потоки и генерирует три экшена: pending (начало загрузки), fulfilled (успешное завершение) и rejected (ошибка сети или вызова).",
      },
    ],
    checklist: [
      "Store настроен через configureStore с подключённым slice",
      "Async-логика реализована через createAsyncThunk",
      "Обработаны все 3 экшена: pending, fulfilled, rejected",
      "Данные читаются через useSelector, действия отправляются через useDispatch",
    ],
  },
  {
    id: "a3",
    title: "3. Загрузка данных (RTK + Селекторы)",
    desc: "Реализуйте загрузку пользователей из внешнего API с помощью createAsyncThunk, строку поиска и мемоизированную фильтрацию с использованием createSelector.",
    candidate: CandidateAdvanced3,
    rawCandidate: CandidateAdvanced3Raw,
    solution: SolutionAdvanced3,
    rawSolution: `// index.jsx\n${SolutionAdvanced3_Index}\n\n// usersSlice.js\n${SolutionAdvanced3_Slice}\n\n// store.js\n${SolutionAdvanced3_Store}`,
    filepath: "src/react/tasks/4_state_management/3_FetchUsersRTKSelectors/index.jsx",
    files: [
      {
        name: "index.jsx",
        filepath: "src/react/tasks/4_state_management/3_FetchUsersRTKSelectors/index.jsx",
        candidateCode: CandidateAdvanced3_Index,
        solutionCode: SolutionAdvanced3_Index,
      },
      {
        name: "usersSlice.js",
        filepath: "src/react/tasks/4_state_management/3_FetchUsersRTKSelectors/usersSlice.js",
        candidateCode: CandidateAdvanced3_Slice,
        solutionCode: SolutionAdvanced3_Slice,
      },
      {
        name: "store.js",
        filepath: "src/react/tasks/4_state_management/3_FetchUsersRTKSelectors/store.js",
        candidateCode: CandidateAdvanced3_Store,
        solutionCode: SolutionAdvanced3_Store,
      },
    ],
    articles: [
      {
        title: "createSelector (Reselect / RTK)",
        urlTitle: "Документация createSelector (Redux Toolkit)",
        url: "https://redux-toolkit.js.org/api/createSelector",
      },
      {
        title: "Селекторы в Doka",
        urlTitle: "Селекторы и мемоизация (Doka.guide)",
        url: "https://doka.guide/tools/redux-toolkit/#selectors",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как мемоизация в createSelector предотвращает лишние пересчеты массива?",
        answer:
          "createSelector отслеживает возвращаемые значения входных селекторов. Если фильтр поиска и список пользователей в глобальном стейте не изменились, он моментально возвращает кэшированный результат.",
      },
    ],
    checklist: [
      "Фильтрация мемоизирована через createSelector из reselect",
      "Входные селекторы возвращают примитивы или ссылки из стейта",
      "Выходной селектор пересчитывается только при изменении входных значений",
      "Строка поиска хранится в Redux и используется в селекторе",
    ],
  },
];

export const LIFECYCLE_TASKS = [
{
    id: "a4",
    title: "1. Порядок вызовов Render, Ref Callback и useEffect (Company X)",
    desc: "Разбор фаз жизненного цикла в React 19: Render phase (синхронно), Commit phase (Ref Callback) и Post-commit phase (useEffect).",
    candidate: CandidateAdvanced4,
    rawCandidate: CandidateAdvanced4Raw,
    solution: SolutionAdvanced4,
    rawSolution: SolutionAdvanced4Raw,
    filepath: "src/react/tasks/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx",
    solutions: [
      {
        title: "Рекомендуемое решение",
        isRecommended: true,
        badge: "Фазы жизненного цикла React 19",
        recommendationNote: "1. Render (синхронно) -> 2. Commit (ref callback) -> 3. Paint -> 4. Post-commit (useEffect асинхронно).",
        rawSolution: SolutionAdvanced4Raw,
        filepath: "src/react/tasks/5_lifecycle_and_runtime/1_ReactRenderRefUseEffect.jsx",
      },
    ],
    articles: [
      {
        title: "Render and Commit (React.dev)",
        urlTitle: "React Docs — Render and Commit",
        url: "https://react.dev/learn/render-and-commit",
      },
      {
        title: "Manipulating the DOM with Refs (React.dev)",
        urlTitle: "React Docs — Manipulating the DOM with Refs",
        url: "https://react.dev/learn/manipulating-the-dom-with-refs",
      },
    ],
    interviewerQuestions: [
      {
        question: "В каком порядке выполняются этапы рендеринга и эффектов при монтировании?",
        answer: "1. Render phase (тело функции, console.log(0)); 2. Commit phase (React мутирует DOM и вызывает ref callback, console.log(2)); 3. Браузер отрисовывает экран (Paint); 4. Post-commit phase (асинхронно вызывается useEffect, console.log(1)).",
      },
      {
        question: "Какое нововведение появилось для ref callback в React 19?",
        answer: "В React 19 ref callback может возвращать функцию очистки (cleanup function), которая вызывается React при размонтировании узла или обновлении ref.",
      },
      {
        question: "Как изменится порядок в режиме разработки под React.StrictMode?",
        answer: "В Development режиме под StrictMode React намеренно монтирует компонент дважды для поиска сайд-эффектов, вызывая рендер и эффекты повторно. В Production монтирование происходит один раз: 0, 2, 1.",
      },
    ],
    checklist: [
      "Среда выполнения: Client-side DOM",
      "Режим: Production (0, 2, 1)",
      "Понимание Render phase vs Commit phase (ref) vs Post-commit phase (useEffect)",
      "Знание поддержки ref cleanup function в React 19",
    ],
  },
  {
    id: "a5",
    title: "2. Порядок вызовов useLayoutEffect, useEffect и Cleanup (Company X)",
    desc: "Глубокий анализ порядка выполнения синхронных вызовов useLayoutEffect, их очисток и эффектов useEffect при первичном монтировании и обновлении состояния.",
    candidate: CandidateAdvanced5,
    rawCandidate: CandidateAdvanced5Raw,
    solution: SolutionAdvanced5,
    rawSolution: SolutionAdvanced5Raw,
    filepath: "src/react/tasks/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx",
    solutions: [
      {
        title: "Рекомендуемое решение",
        isRecommended: true,
        badge: "Фазы жизненного цикла React 19",
        recommendationNote: "useLayoutEffect выполняется синхронно до Paint, useEffect — асинхронно после Paint. Очистки вызываются перед новыми эффектами.",
        rawSolution: SolutionAdvanced5Raw,
        filepath: "src/react/tasks/5_lifecycle_and_runtime/2_ReactLayoutEffectCleanupCycle.jsx",
      },
    ],
    articles: [
      {
        title: "useLayoutEffect (React.dev)",
        urlTitle: "React Docs — useLayoutEffect",
        url: "https://react.dev/reference/react/useLayoutEffect",
      },
      {
        title: "Synchronizing with Effects (React.dev)",
        urlTitle: "React Docs — Synchronizing with Effects",
        url: "https://react.dev/learn/synchronizing-with-effects",
      },
    ],
    interviewerQuestions: [
      {
        question: "В чем фундаментальное различие timing-моделей useLayoutEffect и useEffect?",
        answer: "useLayoutEffect срабатывает синхронно сразу после того, как React обновил DOM, но ДО того, как браузер выполнил отрисовку (Paint). useEffect планируется асинхронно и срабатывает ПОСЛЕ отрисовки экрана.",
      },
      {
        question: "В какой момент вызываются функции очистки (cleanup) эффектов при обновлении state?",
        answer: "Очистка эффекта предыдущего рендера вызывается перед выполнением нового эффекта текущего рендера (при этом layout cleanups выполняются синхронно до paint, а effect cleanups — после paint перед новыми эффектами).",
      },
    ],
    checklist: [
      "Среда выполнения: Browser DOM",
      "Режим: Production",
      "1-й рендер (mount): App -> useLayoutEffect -> useEffect 1 -> useEffect 2",
      "2-й рендер (update): App -> useLayoutEffect cleanup -> useLayoutEffect -> useEffect 1 cleanup -> useEffect 2 cleanup -> useEffect 1 -> useEffect 2",
    ],
  },
];

export const REACT_TS_TASKS = [
  {
    id: "ts1",
    title: "1. Универсальный компонент списка",
    desc: "Реализуйте типобезопасный переиспользуемый компонент List с поддержкой кастомного рендеринга и уникальных ключей.",
    isRaw: true,
    rawCandidate: ReactTsCandidate1,
    rawSolution: ReactTsSolution1,
    filepath: "src/react/tasks/6_typescript_patterns/1_GenericList.tsx",
    articles: [
      {
        title: "Дженерики в TypeScript",
        urlTitle: "Руководство по Дженерикам (Хабр)",
        url: "https://typescriptlang.org/docs/handbook/2/generics.html",
      },
      {
        title: "Дженерик компоненты в React",
        urlTitle: "Создаем Дженерик компоненты в React (Хабр)",
        url: "https://react.dev/learn/updating-arrays-in-state",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Зачем нужна запятая в синтаксисе дженерика в стрелочных функциях внутри TSX файлов?",
        answer:
          "В TSX файлах выражение без запятой компилятор TypeScript принимает за открывающий HTML/JSX тег. Запятая явно заявляет TSX-парсеру, что это объявление параметра Дженерика.",
      },
      {
        question:
          "В чем разница между возвратом React.ReactNode и JSX.Element из функции renderItem?",
        answer:
          "ReactNode включает в себя абсолютно все типы, которые React может отрендерить (строки, числа, JSX-элементы, массивы, null, boolean). JSX.Element требует строго один экземпляр JSX-объекта.",
      },
    ],
    checklist: [
      "Компонент сохраняет и автоматически выводит тип элементов переданного массива",
      "Реализован обязательный механизм извлечения уникального ключа элемента (вместо индекса)",
      "Функция рендеринга типизирована и возвращает валидный для React контент",
      "Код компилируется без использования any",
    ],
  },
  {
    id: "ts2",
    title: "2. Полиморфный компонент кнопки / ссылки",
    desc: "Создайте компонент Button, который может динамически менять базовый HTML-элемент (кнопка, ссылка) с автоподдержкой нативных атрибутов.",
    isRaw: true,
    rawCandidate: ReactTsCandidate2,
    rawSolution: ReactTsSolution2,
    filepath: "src/react/tasks/6_typescript_patterns/2_PolymorphicButton.tsx",
    articles: [
      {
        title: "Полиморфные компоненты в React",
        urlTitle: "Полиморфные компоненты с TypeScript (Хабр)",
        url: "https://react.dev/learn/typescript",
      },
      {
        title: "ComponentPropsWithoutRef",
        urlTitle: "Паттерны типизации пропсов (MonsterLessons)",
        url: "https://typescriptlang.org/docs/handbook/utility-types.html",
      },
    ],
    interviewerQuestions: [
      {
        question: "Что выполняет утилита React.ComponentPropsWithoutRef?",
        answer:
          'Она автоматически извлекает все нативные пропсы и атрибуты HTML-элемента (например href, target для "a" или type, disabled для "button"), за исключением свойства ref.',
      },
      {
        question: "Зачем в типе ButtonProps используется Omit?",
        answer:
          "Omit извлекает атрибуты элемента, исключая совпадения с именами наших собственных пропсов ButtonOwnProps (например, чтобы случайно не перекрыть наш проп as нативным атрибутом).",
      },
    ],
    checklist: [
      "Компонент корректно рендерит указанный в as тег (по умолчанию button)",
      "Автоматически поддерживаются все нативные HTML-атрибуты выбранного элемента",
      "Исключены конфликты между собственными и нативными свойствами",
      "TypeScript подсказывает атрибуты ссылки только при as='a' и кнопки при as='button'",
    ],
  },
  {
    id: "ts3",
    title: "3. Строгая типизация событий и формы",
    desc: "Избавьтесь от any в обработчиках формы, привязав синтетические события React к соответствующим HTML-элементам.",
    isRaw: true,
    rawCandidate: ReactTsCandidate3,
    rawSolution: ReactTsSolution3,
    filepath: "src/react/tasks/6_typescript_patterns/3_TypedEvents.tsx",
    articles: [
      {
        title: "События в React и TS",
        urlTitle: "Гайд по типизации событий в React (Хабр)",
        url: "https://react.dev/reference/react-dom/components/common#handling-events",
      },
      {
        title: "SyntheticEvent в React",
        urlTitle: "События в React (Doka.guide)",
        url: "https://doka.guide/js/events-in-react/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "В чем разница между React.SyntheticEvent и нативным браузерным Event?",
        answer:
          "SyntheticEvent — это кроссбраузерная обертка над нативным событием браузера, обеспечивающая одинаковое поведение и свойства во всех операционных системах и браузерах.",
      },
    ],
    checklist: [
      "Обработчик ввода текста типизирован под HTMLInputElement",
      "Обработчик выбора файла типизирован и безопасно извлекает files",
      "Обработчик нажатия клавиш валидирует key",
      "Обработчик отправки формы типизирован под HTMLFormElement без any",
    ],
  },
  {
    id: "ts4",
    title: "4. Моделирование ролей и сужение типов",
    desc: "Спроектируйте систему типов пользователя, исключающую недопустимые комбинации полей, и реализуйте функцию проверки прав.",
    isRaw: true,
    rawCandidate: ReactTsCandidate4,
    rawSolution: ReactTsSolution4,
    filepath: "src/react/tasks/6_typescript_patterns/4_DiscriminatedUnions.tsx",
    articles: [
      {
        title: "Discriminated Unions",
        urlTitle: "Размеченные объединения в TypeScript (Хабр)",
        url: "https://typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
      },
      {
        title: "Type Guards в TypeScript",
        urlTitle: "Предикаты типов и Type Guards (Metanit)",
        url: "https://typescriptlang.org/docs/handbook/2/narrowing.html",
      },
    ],
    interviewerQuestions: [
      {
        question: "Что такое Discriminated Union (Размеченное объединение)?",
        answer:
          'Это паттерн объединения типов с общим ключевым полем-дискриминантом (например role: "admin" | "guest"), позволяющий TypeScript сужать тип объекта в конструкциях if или switch.',
      },
      {
        question:
          'Что означает синтаксис "user is AdminUser" в возвращаемом типе функции?',
        answer:
          "Это кастомный предикат типа (Type Guard). Если функция возвращает true, TypeScript считает переменную user объектом типа AdminUser во всем последующем теле блока кода.",
      },
    ],
    checklist: [
      "Некорректные состояния (гость с правами администратора) невозможны на уровне типов",
      "Реализован предикат типа (Type Guard) для проверки на администратора",
      "TypeScript автоматически сужает тип пользователя в условных конструкциях",
      "Код не использует небезопасное приведение типов (as)",
    ],
  },
  {
    id: "ts5",
    title: "5. Проектирование типов пропсов и словарей",
    desc: "Сформируйте тип пропсов карточки на основе серверной модели без дублирования кода и создайте строгую карту статусов.",
    isRaw: true,
    rawCandidate: ReactTsCandidate5,
    rawSolution: ReactTsSolution5,
    filepath: "src/react/tasks/6_typescript_patterns/5_UtilityTypesReact.tsx",
    articles: [
      {
        title: "Шпаргалка по Utility Types",
        urlTitle: "Все утилитарные типы TypeScript (Хабр)",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
      {
        title: "Record и Omit",
        urlTitle: "Утилитарные типы (Doka.guide)",
        url: "https://doka.guide/tools/typescript-utility-types/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Какое главное преимущество использования Record перед обычным {[key: string]: Value}?",
        answer:
          "Record требует заполнить значения абсолютно для каждого ключа. Если к объекту статусов добавится новый статус, Record заставит компилятор выдавать ошибку, пока значение не будет заполнено.",
      },
    ],
    checklist: [
      "Тип карточки сформирован на основе базовой модели с исключением приватных полей",
      "Словарь статусов гарантирует заполнение описания для всех возможных статусов",
      "При добавлении нового статуса компилятор требует обновить словарь",
      "Соблюден принцип DRY без ручного дублирования интерфейсов",
    ],
  },
  {
    id: "ts6",
    title: "6. Типизация кастомного хука-переключателя",
    desc: "Исправьте вывод типа возвращаемого значения хука useToggle для безопасной деструктуризации кортежа.",
    isRaw: true,
    rawCandidate: ReactTsCandidate6,
    rawSolution: ReactTsSolution6,
    filepath: "src/react/tasks/6_typescript_patterns/6_TypedCustomHook.tsx",
    articles: [
      {
        title: "Const Assertions (as const)",
        urlTitle: "Зачем нужен as const в TypeScript (Хабр)",
        url: "https://typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference",
      },
      {
        title: "Кортежи (Tuples) в TS",
        urlTitle: "Кортежи в TypeScript (Metanit)",
        url: "https://doka.guide/tools/typescript-types-and-interfaces/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Зачем ставить as const при возврате массива из кастомного хука?",
        answer:
          "Без as const TypeScript выводит возвращаемый тип массива как объединение типы boolean и Function. Использование as const превращает его в неизменяемый фиксированный кортеж (Tuple) readonly [boolean, Function].",
      },
    ],
    checklist: [
      "Хук возвращает точный кортеж с фиксированными позициями элементов",
      "Первый элемент деструктуризации строго типизирован как boolean",
      "Второй элемент деструктуризации типизирован как функция переключения",
      "Результат хука корректно используется в JSX и булевых выражениях без ошибок компиляции",
    ],
  },
  {
    id: "ts7",
    title: "7. Безопасный Context и хук useAuth",
    desc: "Спроектируйте контекст авторизации со строгой защитой от вызова вне дерева провайдера.",
    isRaw: true,
    rawCandidate: ReactTsCandidate7,
    rawSolution: ReactTsSolution7,
    filepath: "src/react/tasks/6_typescript_patterns/7_TypedContext.tsx",
    articles: [
      {
        title: "Типизация React Context",
        urlTitle: "Правильная типизация Context в React (Хабр)",
        url: "https://react.dev/reference/react/useContext",
      },
      {
        title: "React Context API",
        urlTitle: "Контекст в React (Metanit)",
        url: "https://doka.guide/js/react-context/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему createContext({} as ContextType) является антипаттерном?",
        answer:
          "Передача пустого объекта обманывает компилятор. Если вызвать хук контекста вне Provider, приложение упадёт в runtime при вызове методов. Инициализация null с проверкой в useAuth гарантирует безопасность.",
      },
    ],
    checklist: [
      "Контекст инициализирован значением null без фиктивных объектов и as any",
      "Хук useAuth проверяет наличие контекста и выбрасывает понятную ошибку вне Provider",
      "Компоненты получают чистый тип контекста без необходимости проверок на null",
      "Полная типобезопасность методов login и logout",
    ],
  },
  {
    id: "ts8",
    title: "8. Разграничение типов дочерних элементов",
    desc: "Скорректируйте типизацию контейнеров и слотов, разграничив контейнерные children и строгие JSX-элементы.",
    isRaw: true,
    rawCandidate: ReactTsCandidate8,
    rawSolution: ReactTsSolution8,
    filepath: "src/react/tasks/6_typescript_patterns/8_TypedChildrenProps.tsx",
    articles: [
      {
        title: "ReactNode vs ReactElement",
        urlTitle: "Разница между ReactNode и ReactElement (Хабр)",
        url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
      },
      {
        title: "Children в React",
        urlTitle: "Компоненты и Children (Doka.guide)",
        url: "https://doka.guide/js/react-children/",
      },
    ],
    interviewerQuestions: [
      {
        question: "Чем отличатся React.ReactNode от React.ReactElement?",
        answer:
          "ReactNode — супертип для всего рендерящегося (строки, числа, JSX, arrays, null, boolean). ReactElement — строго один экземпляр JSX-объекта (без строк, чисел и null).",
      },
    ],
    checklist: [
      "Контейнер карточки использует стандартную типизацию React для children",
      "Слот иконки строго ограничен до одного валидного React-элемента",
      "Запрещена передача примитивов (строк, чисел) в слот иконки",
      "Все типы соответствуют иерархии React-типов",
    ],
  },
  {
    id: "ts9",
    title: "9. Моделирование состояний в useReducer",
    desc: "Спроектируйте структуру состояния и действий редьюсера для предотвращения противоречивых комбинаций данных.",
    isRaw: true,
    rawCandidate: ReactTsCandidate9,
    rawSolution: ReactTsSolution9,
    filepath: "src/react/tasks/6_typescript_patterns/9_TypedUseReducer.tsx",
    articles: [
      {
        title: "Типизация useReducer",
        urlTitle: "Безопасный useReducer в TypeScript (Хабр)",
        url: "https://react.dev/reference/react/useReducer",
      },
      {
        title: "Хук useReducer",
        urlTitle: "useReducer в React (Metanit)",
        url: "https://doka.guide/js/react-use-reducer/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Какую проблему решает Discriminated Union в состоянии useReducer?",
        answer:
          'Предотвращает некорректные варианты стейта (например одновременное нахождение в loading: true и наличие ошибки error: "..." при успехе).',
      },
    ],
    checklist: [
      "Противоречивые состояния (loading и error одновременно) невозможны на уровне типов",
      "Каждый тип экшена жестко связан с типом своей полезной нагрузки (payload)",
      "TypeScript автоматически сужает тип стейта и экшена внутри switch/case",
      "В компоненте обращение к данным доступно только при успешном статусе",
    ],
  },
  {
    id: "ts10",
    title: "10. Взаимоисключающие пропсы компонента",
    desc: "Спроектируйте пропсы компонента бейджа так, чтобы запретить одновременную передачу конфликтующих параметров.",
    isRaw: true,
    rawCandidate: ReactTsCandidate10,
    rawSolution: ReactTsSolution10,
    filepath: "src/react/tasks/6_typescript_patterns/10_MutuallyExclusiveProps.tsx",
    articles: [
      {
        title: "Взаимоисключающие пропсы",
        urlTitle: "Взаимоисключающие пропсы в TypeScript (Хабр)",
        url: "https://typescriptlang.org/docs/handbook/2/types-from-types.html",
      },
      {
        title: "Тип never в TypeScript",
        urlTitle: "Тип never в TypeScript (Doka.guide)",
        url: "https://doka.guide/tools/typescript-never/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как тип never позволяет запретить проп при передаче другого?",
        answer:
          "Указывая count: number; dot?: never, мы сообщаем TypeScript, что при наличии count свойство dot передано быть не может.",
      },
    ],
    checklist: [
      "Запрещена одновременная передача параметров count и dot",
      "Разрешена передача только числового счетчика count",
      "Разрешена передача только флага точки dot",
      "Разрешен вызов без параметров для пустого бейджа",
    ],
  },
  {
    id: "ts11",
    title: "11. Обобщенный forwardRef в компоненте Select",
    desc: "Сохраните обобщенный тип опций списка при передаче ссылки на нативный элемент через forwardRef.",
    isRaw: true,
    rawCandidate: ReactTsCandidate11,
    rawSolution: ReactTsSolution11,
    filepath: "src/react/tasks/6_typescript_patterns/11_TypedForwardRef.tsx",
    articles: [
      {
        title: "Дженерик forwardRef",
        urlTitle: "Как подружить forwardRef с Дженериками (Хабр)",
        url: "https://react.dev/reference/react/forwardRef",
      },
      {
        title: "Перенаправление рефов",
        urlTitle: "forwardRef в React (Doka.guide)",
        url: "https://doka.guide/js/react-forward-ref/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему стандартный React.forwardRef стирает дженерик параметр T?",
        answer:
          "Встроенные типы React возвращают фиксированный интерфейс ForwardRefExoticComponent, не поддерживающий параметры Дженериков без явного приведения типов сигнатуры.",
      },
    ],
    checklist: [
      "Ссылка ref корректно пробрасывается на HTMLSelectElement",
      "Компонент сохраняет дженерик-тип значений опций",
      "Колбэк onChange получает значение строгого типа без any",
      "TypeScript контролирует соответствие типов value и options при использовании",
    ],
  },
  {
    id: "ts12",
    title: "12. Мутируемые и DOM ссылки в useRef",
    desc: "Устраните ошибку readonly-ссылки таймера и обеспечьте корректное разделение DOM-рефа и мутируемого хранилища.",
    isRaw: true,
    rawCandidate: ReactTsCandidate12,
    rawSolution: ReactTsSolution12,
    filepath: "src/react/tasks/6_typescript_patterns/12_MutableVsImmutableRef.tsx",
    articles: [
      {
        title: "RefObject vs MutableRefObject",
        urlTitle: "Внутренности типов useRef в TypeScript (Хабр)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
      {
        title: "Хук useRef",
        urlTitle: "Хук useRef в React (Doka.guide)",
        url: "https://doka.guide/js/react-use-ref/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          'Почему useRef(null) с типом number дает ошибку "read-only", а с number | null — нет?',
        answer:
          "Сигнатура useRef с null без союза предназначена для DOM-узлов и создает Readonly RefObject. Добавление null в союз дженерика useRef вызывает перегрузку MutableRefObject с возможностью записи.",
      },
    ],
    checklist: [
      "Устранена ошибка 'Cannot assign to current because it is a read-only property'",
      "Ссылка таймера является мутируемой и позволяет сохранять/очищать ID интервала",
      "DOM-ссылка на инпут типизирована для безопасного вызова focus()",
      "Корректно выбраны перегрузки хука useRef",
    ],
  },
];

export const REACT_TS_PRACTICE_TASKS = [
  {
    id: "tsp1",
    title: "1. useEffect + TS (Запрос)",
    desc: "Перепишите код компонента списка пользователей с запросом данных из сетевого API с чистого JSX на TSX с использованием TypeScript.",
    candidate: ReactTsPracticeCandidate1,
    solution: ReactTsPracticeSolution1,
    rawCandidate: ReactTsPracticeCandidate1Raw,
    rawSolution: ReactTsPracticeSolution1Raw,
    filepath: "src/react/tasks/7_typescript_components/1_UseEffectFetch.tsx",
    articles: [
      {
        title: "Типизация useEffect в React и TypeScript",
        urlTitle: "React TypeScript Cheatsheet",
        url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/use_effect/",
      },
      {
        title: "Типизация async/await и fetch в TypeScript",
        urlTitle: "Документация TypeScript (Generics & Promises)",
        url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Почему в catch (e) в TypeScript переменная имеет тип unknown, а не any?",
        answer:
          "В JavaScript через throw можно выбросить любую сущность (строку, число, null, undefined). Начиная с TS 4.4 параметр catch по умолчанию имеет тип unknown, что заставляет явно проверять тип (например, e instanceof Error) перед обращением к свойствам вроде e.message.",
      },
      {
        question:
          "Почему useState([]) без указания дженерика вызывает ошибку при попытке записать данные?",
        answer:
          "Без явного типа TypeScript выводит тип пустой структуры как never[]. Пытаясь записать туда массив элементов User[], вы получите ошибку несоответствия типов, так как тип User не применим к никогда не существующему типу never.",
      },
      {
        question:
          "В чем преимущество Union Type для статуса (type Status = 'idle' | 'loading' | ...) перед обычным string?",
        answer:
          "Union Type ограничивает возможные значения строго заданным множеством строк. Опечатка вроде setStatus('succes') вызовет ошибку компиляции на этапе сборки, а не превратится в скрытый баг в рантайме.",
      },
    ],
    checklist: [
      "Описан interface User с полями id, name, email",
      "Создан Union Type Status = 'idle' | 'loading' | 'success' | 'error'",
      "Функция fetchUsers типизирована с возвращаемым типом Promise<User[]>",
      "Состояние useState типизировано через дженерик: useState<User[]>([]) и useState<Status>('idle')",
      "В блоке catch выполнена проверка e instanceof Error перед считыванием e.message",
    ],
  },
  {
    id: "tsp2",
    title: "2. Работа с изображением + TS",
    desc: "Перепишите компонент RefetchImage (карточка изображения с перезагрузкой по кнопке и использованием blob-URL) с чистого JSX на TSX с использованием TypeScript.",
    candidate: ReactTsPracticeCandidate2,
    solution: ReactTsPracticeSolution2,
    rawCandidate: ReactTsPracticeCandidate2Raw,
    rawSolution: ReactTsPracticeSolution2Raw,
    filepath: "src/react/tasks/7_typescript_components/2_RefetchImage.tsx",
    articles: [
      {
        title: "Типизация useRef в React и TypeScript",
        urlTitle: "React TypeScript Cheatsheet (useRef)",
        url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#useref",
      },
      {
        title: "Типизация компонентов и пропсов в React",
        urlTitle: "Документация React TypeScript",
        url: "https://react.dev/learn/typescript",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как правильно типизировать useRef для хранения мутабельного значения типа string или null (например, URL объекта)?",
        answer:
          "Для хранения изменяемой переменной реф типизируется как useRef<string | null>(null). Это создаёт MutableRefObject, позволяющий переназначать .current.",
      },
    ],
    checklist: [
      "Описан interface TGalleryImage и type TRefetchImageProps",
      "Создан Union Type TStatus = 'idle' | 'loading' | 'success' | 'error'",
      "Реф типизирован как useRef<string | null>(null)",
      "Пропсы компонента RefetchImage типизированы",
    ],
  },
  {
    id: "tsp3",
    title: "3. Менеджер постов + TS",
    desc: "Перепишите компонент PostsManager (загрузка постов по API, добавление локальных постов и удаление) с чистого JSX на TSX с использованием TypeScript.",
    candidate: ReactTsPracticeCandidate3,
    solution: ReactTsPracticeSolution3,
    rawCandidate: ReactTsPracticeCandidate3Raw,
    rawSolution: ReactTsPracticeSolution3Raw,
    filepath: "src/react/tasks/7_typescript_components/3_PostsManager.tsx",
    articles: [
      {
        title: "Наследование интерфейсов в TypeScript",
        urlTitle: "TypeScript Extending Interfaces",
        url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types",
      },
      {
        title: "Типизация событий форм в React",
        urlTitle: "React Form Events in TS",
        url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/",
      },
    ],
    interviewerQuestions: [
      {
        question:
          "Как расширить базовый интерфейс Post для создания LocalPost со свойством isLocal?",
        answer:
          "Используется ключевое слово extends: interface LocalPost extends Post { isLocal?: boolean; }.",
      },
      {
        question:
          "Каким типом следует типизировать параметр события e при отправке формы onSubmit?",
        answer: "Типом React.FormEvent<HTMLFormElement>.",
      },
    ],
    checklist: [
      "Описан базовый interface Post с полями id, title, body?",
      "Создан переиспользуемый interface LocalPost extends Post { isLocal?: boolean }",
      "Описан interface PostsManagerProps { url: string }",
      "Событие формы e в addPost типизировано как React.FormEvent<HTMLFormElement>",
      "Состояние posts типизировано как useState<LocalPost[]>([])",
    ],
  },
];


export const REACT_TASKS = [
  ...WARMUP_TASKS,
  ...REFACTORING_TASKS,
  ...MAIN_TASKS,
  ...ADVANCED_TASKS,
  ...LIFECYCLE_TASKS,
  ...REACT_TS_TASKS,
  ...REACT_TS_PRACTICE_TASKS,
];

export const ALL_TASKS = REACT_TASKS;
