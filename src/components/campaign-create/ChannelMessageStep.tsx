import { useState } from "react";
import { MessageSquare, Smartphone, Bell, Mail, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignFormData, ChannelMessages, ChannelSettings } from "@/pages/CampaignCreate";

interface ChannelMessageStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "am", name: "Amharic" },
  { code: "or", name: "Afaan Oromo" },
  { code: "ti", name: "Tigrigna" },
  { code: "so", name: "Somali" },
];

const personalizationTokens = [
  { token: "{{FirstName}}", label: "First Name" },
  { token: "{{MSISDN}}", label: "Phone Number" },
  { token: "{{Balance}}", label: "Balance" },
  { token: "{{City}}", label: "City" },
  { token: "{{LastTransactionDate}}", label: "Last Transaction Date" },
];

export function ChannelMessageStep({ formData, updateFormData }: ChannelMessageStepProps) {
  const [activeLanguage, setActiveLanguage] = useState<string>("en");

  const handleChannelChange = (channel: keyof typeof formData.channels, checked: boolean) => {
    updateFormData({
      channels: {
        ...formData.channels,
        [channel]: checked,
      },
    });
  };

  const handleMessageChange = (channel: "sms" | "ussd" | "app", lang: string, value: string) => {
    updateFormData({
      channelMessages: {
        ...formData.channelMessages,
        [channel]: {
          ...formData.channelMessages[channel],
          [lang]: value,
        },
      },
    });
  };

  const handleEmailChange = (field: "subject" | "body", value: string) => {
    updateFormData({
      emailContent: {
        ...formData.emailContent,
        [field]: value,
      },
    });
  };

  const handleEmailLanguageChange = (lang: string) => {
    updateFormData({
      emailContent: {
        ...formData.emailContent,
        language: lang,
      },
    });
  };

  const handleChannelSettingChange = (
    channel: keyof ChannelSettings,
    setting: "cap" | "retryOnFailure" | "priority",
    value: number | boolean
  ) => {
    updateFormData({
      channelSettings: {
        ...formData.channelSettings,
        [channel]: {
          ...formData.channelSettings[channel],
          [setting]: value,
        },
      },
    });
  };

  const insertToken = (token: string, channel: string, lang?: string) => {
    if (channel === "email") {
      const currentBody = formData.emailContent.body;
      handleEmailChange("body", currentBody + token);
    } else if (lang) {
      const currentMsg = formData.channelMessages[channel as keyof ChannelMessages]?.[lang] || "";
      handleMessageChange(channel as "sms" | "ussd" | "app", lang, currentMsg + token);
    }
  };

  const getSmsCharCount = (lang: string) => formData.channelMessages.sms?.[lang]?.length || 0;
  const getSmsCredits = (lang: string) => Math.ceil((formData.channelMessages.sms?.[lang]?.length || 0) / 160) || 0;

  const selectedChannelsCount = Object.values(formData.channels).filter(Boolean).length;
  const showPriorityWarning = selectedChannelsCount > 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Channel & Message</h2>
        <p className="text-sm text-muted-foreground">Define how customers will be contacted</p>
      </div>

      {/* Channel Selection */}
      <div className="space-y-3">
        <Label>Select Channels</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.sms ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.sms}
              onCheckedChange={(checked) => handleChannelChange("sms", !!checked)}
            />
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">SMS</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.ussd ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.ussd}
              onCheckedChange={(checked) => handleChannelChange("ussd", !!checked)}
            />
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">USSD</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.app ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.app}
              onCheckedChange={(checked) => handleChannelChange("app", !!checked)}
            />
            <Bell className="w-5 h-5" />
            <span className="font-medium">App Push</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.email ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.email}
              onCheckedChange={(checked) => handleChannelChange("email", !!checked)}
            />
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email</span>
          </label>
        </div>
        {showPriorityWarning && (
          <p className="text-sm text-info">
            ⚠️ Multiple channels selected. Set priority for each channel below.
          </p>
        )}
      </div>

      {/* Message Editors with Language Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* SMS / USSD / App Push - Multi-language */}
          {(formData.channels.sms || formData.channels.ussd || formData.channels.app) && (
            <div className="border p-4 space-y-4">
              <h3 className="font-semibold">SMS / USSD / App Push Messages</h3>
              
              {/* Language Tabs */}
              <div className="flex flex-wrap gap-2">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLanguage(lang.code)}
                    className={`px-4 py-2 text-sm font-medium border transition-colors ${
                      activeLanguage === lang.code
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* SMS Editor */}
              {formData.channels.sms && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <Label>SMS Message ({supportedLanguages.find(l => l.code === activeLanguage)?.name})</Label>
                  </div>
                  <Textarea
                    placeholder="Enter your SMS message..."
                    value={formData.channelMessages.sms?.[activeLanguage] || ""}
                    onChange={(e) => handleMessageChange("sms", activeLanguage, e.target.value)}
                    rows={4}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getSmsCharCount(activeLanguage)} characters ({getSmsCredits(activeLanguage)} SMS credit{getSmsCredits(activeLanguage) !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>
              )}

              {/* USSD Editor */}
              {formData.channels.ussd && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <Label>USSD Message ({supportedLanguages.find(l => l.code === activeLanguage)?.name})</Label>
                  </div>
                  <Textarea
                    placeholder="Enter USSD push message..."
                    value={formData.channelMessages.ussd?.[activeLanguage] || ""}
                    onChange={(e) => handleMessageChange("ussd", activeLanguage, e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* App Push Editor */}
              {formData.channels.app && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <Label>App Push ({supportedLanguages.find(l => l.code === activeLanguage)?.name})</Label>
                  </div>
                  <Textarea
                    placeholder="Enter app notification message..."
                    value={formData.channelMessages.app?.[activeLanguage] || ""}
                    onChange={(e) => handleMessageChange("app", activeLanguage, e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* Email - Single Language */}
          {formData.channels.email && (
            <div className="border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Template
                </h3>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Language:</Label>
                  <Select
                    value={formData.emailContent.language}
                    onValueChange={handleEmailLanguageChange}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Subject</Label>
                  <Input
                    placeholder="Email subject line"
                    value={formData.emailContent.subject}
                    onChange={(e) => handleEmailChange("subject", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Body</Label>
                  <Textarea
                    placeholder="Email body content..."
                    value={formData.emailContent.body}
                    onChange={(e) => handleEmailChange("body", e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Channel Controls */}
          {Object.values(formData.channels).some((v) => v) && (
            <div className="border p-4 space-y-4">
              <h3 className="font-semibold">Channel Controls</h3>
              <div className="space-y-4">
                {formData.channels.sms && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 border">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">SMS</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Channel Cap</Label>
                      <Input
                        type="number"
                        placeholder="Cap"
                        value={formData.channelSettings.sms.cap || ""}
                        onChange={(e) => handleChannelSettingChange("sms", "cap", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority (1=highest)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        placeholder="1"
                        value={formData.channelSettings.sms.priority || ""}
                        onChange={(e) => handleChannelSettingChange("sms", "priority", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        checked={formData.channelSettings.sms.retryOnFailure}
                        onCheckedChange={(checked) => handleChannelSettingChange("sms", "retryOnFailure", checked)}
                      />
                      <div className="flex items-center gap-1 text-sm">
                        <RotateCcw className="w-3 h-3" />
                        Retry on Failure
                      </div>
                    </div>
                  </div>
                )}

                {formData.channels.ussd && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 border">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="font-medium">USSD</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Channel Cap</Label>
                      <Input
                        type="number"
                        placeholder="Cap"
                        value={formData.channelSettings.ussd.cap || ""}
                        onChange={(e) => handleChannelSettingChange("ussd", "cap", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority (1=highest)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        placeholder="2"
                        value={formData.channelSettings.ussd.priority || ""}
                        onChange={(e) => handleChannelSettingChange("ussd", "priority", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        checked={formData.channelSettings.ussd.retryOnFailure}
                        onCheckedChange={(checked) => handleChannelSettingChange("ussd", "retryOnFailure", checked)}
                      />
                      <div className="flex items-center gap-1 text-sm">
                        <RotateCcw className="w-3 h-3" />
                        Retry on Failure
                      </div>
                    </div>
                  </div>
                )}

                {formData.channels.app && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 border">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span className="font-medium">App Push</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Channel Cap</Label>
                      <Input
                        type="number"
                        placeholder="Cap"
                        value={formData.channelSettings.app.cap || ""}
                        onChange={(e) => handleChannelSettingChange("app", "cap", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority (1=highest)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        placeholder="3"
                        value={formData.channelSettings.app.priority || ""}
                        onChange={(e) => handleChannelSettingChange("app", "priority", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        checked={formData.channelSettings.app.retryOnFailure}
                        onCheckedChange={(checked) => handleChannelSettingChange("app", "retryOnFailure", checked)}
                      />
                      <div className="flex items-center gap-1 text-sm">
                        <RotateCcw className="w-3 h-3" />
                        Retry on Failure
                      </div>
                    </div>
                  </div>
                )}

                {formData.channels.email && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 border">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Channel Cap</Label>
                      <Input
                        type="number"
                        placeholder="Cap"
                        value={formData.channelSettings.email.cap || ""}
                        onChange={(e) => handleChannelSettingChange("email", "cap", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority (1=highest)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        placeholder="4"
                        value={formData.channelSettings.email.priority || ""}
                        onChange={(e) => handleChannelSettingChange("email", "priority", Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        checked={formData.channelSettings.email.retryOnFailure}
                        onCheckedChange={(checked) => handleChannelSettingChange("email", "retryOnFailure", checked)}
                      />
                      <div className="flex items-center gap-1 text-sm">
                        <RotateCcw className="w-3 h-3" />
                        Retry on Failure
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Personalization Tokens Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold">Personalization Tokens</h3>
          <div className="border p-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Click a token to insert it at cursor position
            </p>
            {personalizationTokens.map((item) => (
              <button
                key={item.token}
                onClick={() => {
                  if (formData.channels.email) {
                    insertToken(item.token, "email");
                  } else if (formData.channels.sms) {
                    insertToken(item.token, "sms", activeLanguage);
                  } else if (formData.channels.ussd) {
                    insertToken(item.token, "ussd", activeLanguage);
                  } else if (formData.channels.app) {
                    insertToken(item.token, "app", activeLanguage);
                  }
                }}
                className="w-full text-left p-2 border hover:bg-muted/50 transition-colors"
              >
                <Badge variant="secondary" className="font-mono">
                  {item.token}
                </Badge>
                <span className="text-sm text-muted-foreground ml-2">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!Object.values(formData.channels).some((v) => v) && (
        <div className="border p-8 text-center text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Select a channel above to configure messages</p>
        </div>
      )}
    </div>
  );
}
