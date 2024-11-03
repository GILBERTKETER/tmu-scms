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
  IconLinkedin,
  IconTwitter,
  IconInstagram,
  IconFacebook,
  IconYoutube,
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
      return <IconLinkedin />;
    case 'twitter':
      return <IconTwitter />;
    case 'instagram':
      return <IconInstagram />;
    case 'facebook':
      return <IconFacebook />;
    case 'youtube':
      return <IconYoutube />;
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
  
      const userId: number = user.id
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