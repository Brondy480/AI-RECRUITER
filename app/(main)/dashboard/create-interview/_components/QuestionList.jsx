import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import supabase from '@/service/supabaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({ formData, onCreateLink }) {
    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [finishing, setFinishing] = useState(false);
    const { user } = useUser();

    // ✅ USER-TRIGGERED GENERATION
    const GenerateQuestionList = async () => {
        if (!formData?.jobPosition || !formData?.jobDescription) {
            toast("Missing job details");
            return;
        }

        setLoading(true);

        try {
            const result = await axios.post('/api/ai-model', { ...formData });

            const content = result.data?.message?.content;
            if (!content) {
                console.error("Raw API response:", result.data);
                throw new Error("No content received from API");
            }

            let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            let parsed = JSON.parse(cleaned);

            const questions = Array.isArray(parsed)
                ? parsed
                : parsed.interviewQuestions || [];

            if (!questions.length) throw new Error("No questions generated");

            setQuestionList(questions);
            toast("Questions generated successfully");
        } catch (err) {
            console.error(err);
            toast("Failed to generate questions");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async () => {
        if (!questionList.length) return;

        setFinishing(true);
        const interview_id = uuidv4();

        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            await supabase.from('Interviews').insert([{
                ...formData,
                questionList,
                interview_id,
                userEmail: currentUser.email
            }]);

            await supabase
                .from('Users')
                .update({ credits: Number(user.credits) - 1 })
                .eq('email', currentUser.email);

            toast("Interview created");
            onCreateLink(interview_id);
        } catch (e) {
            toast("Failed to save interview");
            console.error(e);
        } finally {
            setFinishing(false);
        }
    };

    return (
        <div className="p-6">
            <button
                onClick={GenerateQuestionList}
                className="mb-6 bg-blue-500 text-white px-6 py-3 rounded-lg"
                disabled={loading}
            >
                {loading ? <Loader2Icon className="animate-spin" /> : "Generate Questions"}
            </button>

            {questionList.length > 0 && (
                <QuestionListContainer questionsList={questionList} />
            )}

            <div className="flex justify-end mt-10">
                <button
                    onClick={onFinish}
                    disabled={finishing || !questionList.length}
                    className="bg-green-600 text-white px-6 py-4 rounded-xl"
                >
                    {finishing ? "Saving..." : "Create Interview Link & Finish"}
                </button>
            </div>
        </div>
    );
}

export default QuestionList;
