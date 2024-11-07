import React, { useEffect,useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Tag,
  Grid,
  Message,
  Select,
  Link,
  Upload
} from '@arco-design/web-react';
import {
  IconPlus,
  IconDelete,
  IconTwitter,
  IconFacebook,
  IconVideoCamera,
  IconGithub,
  IconLink,
  IconUpload
} from '@arco-design/web-react/icon';;
import App from "@/app/(site)/api/api"
const FormItem = Form.Item;
const { Row, Col } = Grid;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
import { useAuth } from '@/context/Auth';
// Interfaces
interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface SocialMedia {
  platform: string;
  username: string;
  url: string;
  description?: string;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  summary: string;
  profileImage?: string;
  coverPhoto?: string;
}

interface StudentPortfolioForm {
  personalInfo: PersonalInfo;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  socialMedia: SocialMedia[];
}

// Helper Functions
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="24" cy="24" r="20" fill="#0077B5"></circle> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7747 14.2839C18.7747 15.529 17.8267 16.5366 16.3442 16.5366C14.9194 16.5366 13.9713 15.529 14.0007 14.2839C13.9713 12.9783 14.9193 12 16.3726 12C17.8267 12 18.7463 12.9783 18.7747 14.2839ZM14.1199 32.8191V18.3162H18.6271V32.8181H14.1199V32.8191Z" fill="white"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2393 22.9446C22.2393 21.1357 22.1797 19.5935 22.1201 18.3182H26.0351L26.2432 20.305H26.3322C26.9254 19.3854 28.4079 17.9927 30.8101 17.9927C33.7752 17.9927 35.9995 19.9502 35.9995 24.219V32.821H31.4922V24.7838C31.4922 22.9144 30.8404 21.6399 29.2093 21.6399C27.9633 21.6399 27.2224 22.4999 26.9263 23.3297C26.8071 23.6268 26.7484 24.0412 26.7484 24.4574V32.821H22.2411V22.9446H22.2393Z" fill="white"></path> </g></svg>;
    case 'twitter':
      return <IconTwitter />;
    case 'instagram':
      return <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="24" cy="24" r="20" fill="#C13584"></circle> <path d="M24 14.1622C27.2041 14.1622 27.5837 14.1744 28.849 14.2321C30.019 14.2855 30.6544 14.481 31.0773 14.6453C31.6374 14.863 32.0371 15.123 32.457 15.5429C32.877 15.9629 33.137 16.3626 33.3547 16.9227C33.519 17.3456 33.7145 17.981 33.7679 19.1509C33.8256 20.4163 33.8378 20.7958 33.8378 23.9999C33.8378 27.2041 33.8256 27.5836 33.7679 28.849C33.7145 30.019 33.519 30.6543 33.3547 31.0772C33.137 31.6373 32.877 32.0371 32.4571 32.457C32.0371 32.8769 31.6374 33.1369 31.0773 33.3546C30.6544 33.519 30.019 33.7144 28.849 33.7678C27.5839 33.8255 27.2044 33.8378 24 33.8378C20.7956 33.8378 20.4162 33.8255 19.151 33.7678C17.981 33.7144 17.3456 33.519 16.9227 33.3546C16.3626 33.1369 15.9629 32.8769 15.543 32.457C15.1231 32.0371 14.863 31.6373 14.6453 31.0772C14.481 30.6543 14.2855 30.019 14.2321 28.849C14.1744 27.5836 14.1622 27.2041 14.1622 23.9999C14.1622 20.7958 14.1744 20.4163 14.2321 19.1509C14.2855 17.981 14.481 17.3456 14.6453 16.9227C14.863 16.3626 15.123 15.9629 15.543 15.543C15.9629 15.123 16.3626 14.863 16.9227 14.6453C17.3456 14.481 17.981 14.2855 19.151 14.2321C20.4163 14.1744 20.7959 14.1622 24 14.1622ZM24 12C20.741 12 20.3323 12.0138 19.0524 12.0722C17.7752 12.1305 16.9028 12.3333 16.1395 12.63C15.3504 12.9366 14.6812 13.3469 14.0141 14.0141C13.3469 14.6812 12.9366 15.3504 12.63 16.1395C12.3333 16.9028 12.1305 17.7751 12.0722 19.0524C12.0138 20.3323 12 20.741 12 23.9999C12 27.259 12.0138 27.6676 12.0722 28.9475C12.1305 30.2248 12.3333 31.0971 12.63 31.8604C12.9366 32.6495 13.3469 33.3187 14.0141 33.9859C14.6812 34.653 15.3504 35.0633 16.1395 35.3699C16.9028 35.6666 17.7752 35.8694 19.0524 35.9277C20.3323 35.9861 20.741 35.9999 24 35.9999C27.259 35.9999 27.6677 35.9861 28.9476 35.9277C30.2248 35.8694 31.0972 35.6666 31.8605 35.3699C32.6496 35.0633 33.3188 34.653 33.9859 33.9859C34.653 33.3187 35.0634 32.6495 35.37 31.8604C35.6667 31.0971 35.8695 30.2248 35.9278 28.9475C35.9862 27.6676 36 27.259 36 23.9999C36 20.741 35.9862 20.3323 35.9278 19.0524C35.8695 17.7751 35.6667 16.9028 35.37 16.1395C35.0634 15.3504 34.653 14.6812 33.9859 14.0141C33.3188 13.3469 32.6496 12.9366 31.8605 12.63C31.0972 12.3333 30.2248 12.1305 28.9476 12.0722C27.6677 12.0138 27.259 12 24 12Z" fill="white"></path> <path d="M24.0059 17.8433C20.6026 17.8433 17.8438 20.6021 17.8438 24.0054C17.8438 27.4087 20.6026 30.1675 24.0059 30.1675C27.4092 30.1675 30.1681 27.4087 30.1681 24.0054C30.1681 20.6021 27.4092 17.8433 24.0059 17.8433ZM24.0059 28.0054C21.7968 28.0054 20.0059 26.2145 20.0059 24.0054C20.0059 21.7963 21.7968 20.0054 24.0059 20.0054C26.2151 20.0054 28.0059 21.7963 28.0059 24.0054C28.0059 26.2145 26.2151 28.0054 24.0059 28.0054Z" fill="white"></path> <path d="M31.8507 17.5963C31.8507 18.3915 31.206 19.0363 30.4107 19.0363C29.6154 19.0363 28.9707 18.3915 28.9707 17.5963C28.9707 16.801 29.6154 16.1562 30.4107 16.1562C31.206 16.1562 31.8507 16.801 31.8507 17.5963Z" fill="white"></path> </g></svg>;
    case 'facebook':
      return <IconFacebook />;
    case 'youtube':
      return <IconVideoCamera />;
    case 'github':
      return <IconGithub />;
    default:
      return <IconLink />;
  }
};

// Main Component
const StudentPortfolio: React.FC = () => {
  const [form] = Form.useForm<StudentPortfolioForm>();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        personalInfo: {
          fullName: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone_number,
          // Keep other fields as is if they exist
          ...form.getFieldValue('personalInfo'),
        }
      });
    }
  }, [user, form]);

  

  // const handleSubmit = async (values: StudentPortfolioForm) => {
  //   setLoading(true);
  //   try {
  //     const response = App.post("/api/portfolio/", values)
  //     console.log('Form values:', values);
  //     Message.success(response.data.message||'Portfolio saved successfully!');
  //   } catch (error) {
  //     Message.error('Failed to save portfolio');
  //     console.error('Error saving portfolio:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (values: StudentPortfolioForm) => {
    setLoading(true);
    try {
      // Upload profile image if provided
      if (profileImageUrl) {
        const profileImageFile = new File([], profileImageUrl.split('/').pop() || 'profile.png', { type: 'image/png' });
        await handleImageUpload(profileImageFile, 'profile');
      }
  
      // Upload cover photo if provided
      if (coverPhotoUrl) {
        const coverPhotoFile = new File([], coverPhotoUrl.split('/').pop() || 'cover.png', { type: 'image/png' });
        await handleImageUpload(coverPhotoFile, 'cover');
      }
  
      // Include image URLs in the form data
      const portfolioData = {
        ...values,
        personalInfo: {
          ...values.personalInfo,
          profileImage: profileImageUrl,
          coverPhoto: coverPhotoUrl,
        },
      };
  
      // Submit the portfolio data
      const response = await App.post("/api/portfolio/", portfolioData);
      Message.success(response.data.message || 'Portfolio saved successfully!');
    } catch (error) {
      Message.error('Failed to save portfolio');
      console.error('Error saving portfolio:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      form.setFieldValue('skills', updatedSkills);
      setNewSkill('');
    }
  };


  

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    try {
      if (!user?.id) {
        Message.error('User ID not found');
        return '';
      }
  
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Message.error('Please upload an image file (JPG, PNG, GIF, or WebP)');
        return '';
      }
  
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Message.error('File size should be less than 5MB');
        return '';
      }
  
      const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
      
      const filename = `img-${user.id}-${type}.${extension}`;
  
      const objectUrl = URL.createObjectURL(file);
  
      const userId: number = user?.id
      if (type === 'profile') {
        setProfileImageUrl(objectUrl);
      } else {
        setCoverPhotoUrl(objectUrl);
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', filename);
      formData.append('type', type);
      formData.append('id', userId);
  
      const response = await App.post('/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to upload image');
      }
  
      return `/images/${filename}`;
  
    } catch (error) {
      Message.error('Failed to upload image');
      console.error('Error uploading image:', error);
      return '';
    }
  };
  

  const imageUploadSection = (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <FormItem
          label="Profile Image"
          field="personalInfo.profileImage"
        >
          <Upload
            listType="picture-card"
            limit={1}
            beforeUpload={(file) => {
              handleImageUpload(file, 'profile');
              return false;
            }}
            imagePreview
            defaultFileList={
              profileImageUrl 
                ? [{
                    uid: '1',
                    name: 'profile',
                    url: profileImageUrl
                  }] 
                : []
            }
          >
            <div className="flex flex-col items-center justify-center">
              <IconUpload />
              <div className="mt-2">Upload Profile Image</div>
            </div>
          </Upload>
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem
          label="Cover Photo"
          field="personalInfo.coverPhoto"
        >
          <Upload
            listType="picture-card"
            limit={1}
            beforeUpload={(file) => {
              handleImageUpload(file, 'cover');
              return false;
            }}
            imagePreview
            defaultFileList={
              coverPhotoUrl 
                ? [{
                    uid: '1',
                    name: 'cover',
                    url: coverPhotoUrl
                  }] 
                : []
            }
          >
            <div className="flex flex-col items-center justify-center">
              <IconUpload />
              <div className="mt-2">Upload Cover Photo</div>
            </div>
          </Upload>
        </FormItem>
      </Col>
    </Row>
  );
  
  return (
    <div className="student-portfolio" style={{ padding: '24px' }}>
      <Card>
        <Title heading={2} style={{ marginBottom: '24px' }}>
          Student Portfolio Builder
        </Title>
        
        <Form
          form={form}
          autoComplete="off"
          onSubmit={handleSubmit}
          layout="vertical"
          style={{ maxWidth: 1200 }}
        >
          {/* Personal Information Section */}
         <Card title="Personal Information" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormItem
                  label="Full Name"
                  field="personalInfo.fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input readOnly placeholder="Enter your full name" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Email"
                  field="personalInfo.email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input readOnly placeholder="Enter your email" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormItem
                  label="Phone"
                  field="personalInfo.phone"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input readOnly placeholder="Enter your phone number" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Location"
                  field="personalInfo.location"
                  rules={[{ required: true, message: 'Please enter your location' }]}
                >
                  <Input placeholder="City, Country" />
                </FormItem>
              </Col>
            </Row>
            
            {imageUploadSection}

            <FormItem
              label="Professional Summary"
              field="personalInfo.summary"
              rules={[{ required: true, message: 'Please enter your professional summary' }]}
            >
              <TextArea
                placeholder="Write a brief professional summary about yourself"
                style={{ minHeight: 120 }}
              />
            </FormItem>
          </Card>

          {/* Skills Section */}
          <Card title="Skills" bordered={false} style={{ marginTop: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={20}>
                <FormItem 
              label="Skills" 
              field="skills"
              rules={[{ required: true, message: 'Please enter your professional summary' }]}
            >
                  <Input
                    value={newSkill}
                    onChange={setNewSkill}
                    placeholder="Add a skill (e.g., React, Python, Project Management)"
                    onPressEnter={(e) => {
                      e.preventDefault();
                      addSkill();
                    }}
                  />
                  </FormItem>
                </Col>
                <Col span={4}>
                  <Button type="primary" icon={<IconPlus />} onClick={addSkill}>
                    Add Skill
                  </Button>
                </Col>
              </Row>
              <Space wrap>
                {skills.map((skill, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => {
                      const updatedSkills = skills.filter((_, i) => i !== index);
                      setSkills(updatedSkills);
                      form.setFieldValue('skills', updatedSkills);
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Card>

          {/* Experience Section */}
          <Form.List field="experiences">
            {(fields, { add, remove }) => (
              <Card
                title="Work Experience"
                bordered={false}
                style={{ marginTop: 24 }}
                extra={
                  <Button type="primary" icon={<IconPlus />} onClick={() => add()}>
                    Add Experience
                  </Button>
                }
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    bordered={false}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        icon={<IconDelete />}
                        status="danger"
                        onClick={() => remove(index)}
                      />
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.company`}
                          label="Company"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Company name" />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.position`}
                          label="Position"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Job title" />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <FormItem
                          field={`${field.field}.duration`}
                          label="Duration"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="e.g., Jan 2020 - Present" />
                        </FormItem>
                      </Col>
                    </Row>
                    <FormItem
                      field={`${field.field}.description`}
                      label="Description"
                      rules={[{ required: true }]}
                    >
                      <TextArea 
                        placeholder="Describe your responsibilities and achievements"
                        style={{ minHeight: 100 }}
                      />
                    </FormItem>
                  </Card>
                ))}
              </Card>
            )}
          </Form.List>

          {/* Education Section */}
          <Form.List field="education">
            {(fields, { add, remove }) => (
              <Card
                title="Education"
                bordered={false}
                style={{ marginTop: 24 }}
                extra={
                  <Button type="primary" icon={<IconPlus />} onClick={() => add()}>
                    Add Education
                  </Button>
                }
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    bordered={false}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        icon={<IconDelete />}
                        status="danger"
                        onClick={() => remove(index)}
                      />
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.institution`}
                          label="Institution"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="School/University name" />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.degree`}
                          label="Degree"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Degree and major" />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.year`}
                          label="Year"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Graduation year" />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem field={`${field.field}.gpa`} label="GPA">
                          <Input placeholder="GPA (optional)" />
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Card>
            )}
          </Form.List>

          {/* Projects Section */}
          <Form.List field="projects">
            {(fields, { add, remove }) => (
              <Card
                title="Projects"
                bordered={false}
                style={{ marginTop: 24 }}
                extra={
                  <Button type="primary" icon={<IconPlus />} onClick={() => add()}>
                    Add Project
                  </Button>
                }
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    bordered={false}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        icon={<IconDelete />}
                        status="danger"
                        onClick={() => remove(index)}
                      />
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.name`}
                          label="Project Name"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Project name" />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          field={`${field.field}.technologies`}
                          label="Technologies Used"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="e.g., React, Node.js, MongoDB" />
                        </FormItem>
                      </Col>
                    </Row>
                    <FormItem
                      field={`${field.field}.description`}
                      label="Description"
                      rules={[{ required: true }]}
                    >
                      <TextArea 
                        placeholder="Describe your project"
                        style={{ minHeight: 100 }}
                      />
                    </FormItem>
                    <FormItem field={`${field.field}.link`} label="Project Link">
                      <Input placeholder="Project URL (if available)" />
                    </FormItem>
                  </Card>
                ))}
              </Card>
            )}
          </Form.List>

          {/* Social Media Section */}
          <Form.List field="socialMedia">
            {(fields, { add, remove }) => (
              <Card
                title="Social Media Profiles"
                bordered={false}
                style={{ marginTop: 24 }}
                extra={
                  <Button type="primary" icon={<IconPlus />} onClick={() => add()}>
                    Add Social Media
                  </Button>
                }
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    bordered={false}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        icon={<IconDelete />}
                        status="danger"
                        onClick={() => remove(index)}
                      />
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <FormItem
                          field={`${field.field}.platform`}
                          label="Platform"
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="Select platform">
                            <Select.Option value="linkedin">LinkedIn</Select.Option>
                            <Select.Option value="twitter">Twitter/X</Select.Option>
                            <Select.Option value="instagram">Instagram</Select.Option>
                            <Select.Option value="facebook">Facebook</Select.Option>
                            <Select.Option value="youtube">YouTube</Select.Option>
                            <Select.Option value="tiktok">TikTok</Select.Option>
                            <Select.Option value="behance">Behance</Select.Option>
                            <Select.Option value="dribbble">Dribbble</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="stackoverflow">Stack Overflow</Select.Option>
                            <Select.Option value="github">GitHub</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          field={`${field.field}.username`}
                          label="Username/Handle"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Your username on this platform" />
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          field={`${field.field}.url`}
                          label="Profile URL"
                          rules={[
                            { required: true },
                            { type: 'url', message: 'Please enter a valid URL' }
                          ]}
                        >
                          <Input placeholder="https://..." />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <FormItem
                          field={`${field.field}.description`}
                          label="Description (Optional)"
                        >
                          <TextArea 
                            placeholder="Brief description of your content/activity on this platform" 
                            style={{ minHeight: 60 }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                  <Paragraph type="secondary">
                    Tips for social media profiles:
                    <ul>
                      <li>Ensure all profile URLs are correct and accessible</li>
                      <li>Keep usernames consistent across platforms when possible</li>
                      <li>Add platforms relevant to your professional field</li>
                      <li>Make sure profiles are professional and up-to-date</li>
                    </ul>
                  </Paragraph>
                </Space>
              </Card>
            )}
          </Form.List>

          {/* Footer with Social Links and Submit Button */}
          <Card bordered={false} style={{ marginTop: 24, marginBottom: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical">
                  <Title heading={6}>Connect with me:</Title>
                  <Space size="large">
                    {form.getFieldValue('socialMedia')?.map((social: SocialMedia, index: number) => (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        style={{ color: 'var(--color-text-2)' }}
                      >
                        <Space>
                          {getPlatformIcon(social.platform)}
                          <span>{social.platform}</span>
                        </Space>
                      </Link>
                    ))}
                  </Space>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button 
                    type="secondary" 
                    size="large"
                    onClick={() => form.resetFields()}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={loading}
                  >
                    Save Portfolio
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Form>
      </Card>
    </div>
  );
};

export default StudentPortfolio;