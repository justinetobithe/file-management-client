import React from 'react';
import { toast } from './ui/use-toast';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';

interface AppInputFileProps {
    onChange: (files: FileList) => void;
    multiple?: boolean;
    name?: string;
    acceptAll?: boolean;
}

const AppInputFile: React.FC<AppInputFileProps> = ({ onChange, multiple, name, acceptAll = false }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files;

            const allowedTypes = acceptAll
                ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
                : ['application/pdf'];

            const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

            if (validFiles.length !== files.length) {
                const allowedFormats = acceptAll
                    ? 'PDF, DOC, DOCX, JPG, JPEG, PNG'
                    : 'PDF';

                toast({
                    title: 'Invalid File Type',
                    description: `Only ${allowedFormats} files are allowed.`,
                    variant: 'destructive',
                    duration: 3000,
                });

                return;
            }

            onChange(files);

            e.target.value = '';
        }
    };


    return (
        <FormItem>
            <FormLabel htmlFor={`custom-file-input-${name}`} className="block text-sm font-medium text-gray-700">
                Upload File
            </FormLabel>
            <FormControl>
                <Input
                    id={`custom-file-input-${name}`}
                    name={`custom-file-input-${name}`}
                    type="file"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                    accept={acceptAll ? '.doc,.docx,.pdf,.jpg,.jpeg,.png' : '.pdf'}
                    onChange={handleFileChange}
                    multiple={multiple}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default AppInputFile;
