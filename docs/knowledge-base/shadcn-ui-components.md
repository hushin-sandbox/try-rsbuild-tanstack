# shadcn/ui Components Summary

## Combobox

### Description
Autocomplete input and command palette with a list of suggestions.

---

## Data Table

### Description
Powerful table and datagrids built using TanStack Table.

### Installation
```bash
npx shadcn@latest add table
```

---

## Tabs

### Description
A set of layered sections of content—known as tab panels—that are displayed one at a time.

### Installation
```bash
npx shadcn@latest add tabs
```

### Usage
```tsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

---

## Alert Dialog

### Description
A modal dialog that interrupts the user with important content and expects a response.

### Installation
```bash
npx shadcn@latest add alert-dialog
```

### Usage
```tsx
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Calendar

### Description
A date field component that allows users to enter and edit date.

### Installation
```bash
npx shadcn@latest add calendar
```

### Usage
```tsx
const [date, setDate] = React.useState<Date | undefined>(new Date())

return (
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-md border"
  />
)
```

---

## Collapsible

### Description
An interactive component which expands/collapses a panel.

### Installation
```bash
npx shadcn@latest add collapsible
```

### Usage
```tsx
<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution
    required.
  </CollapsibleContent>
</Collapsible>
```

---

## Textarea

### Description
Displays a form textarea or a component that looks like a textarea.

### Installation
```bash
npx shadcn@latest add textarea
```

### Usage
```tsx
<Textarea />
```

---

## Aspect Ratio

### Description
Displays content within a desired ratio.

### Installation
```bash
npx shadcn@latest add aspect-ratio
```

### Usage
```tsx
<div className="w-[450px]">
  <AspectRatio ratio={16 / 9}>
    <Image src="..." alt="Image" className="rounded-md object-cover" />
  </AspectRatio>
</div>
```

---

## React Hook Form

### Description
Building forms with React Hook Form and Zod.

### Installation
```bash
npx shadcn@latest add form
```

---

## Alert

### Description
Displays a callout for user attention.

### Installation
```bash
npx shadcn@latest add alert
```

### Usage
```tsx
<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

---

## Hover Card

### Description
For sighted users to preview content available behind a link.

### Installation
```bash
npx shadcn@latest add hover-card
```

### Usage
```tsx
<HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent>
    The React Framework – created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>
```

---

## Toggle

### Description
A two-state button that can be either on or off.

### Installation
```bash
npx shadcn@latest add toggle
```

### Usage
```tsx
<Toggle>Toggle</Toggle>
```

---

## Popover

### Description
Displays rich content in a portal, triggered by a button.

### Installation
```bash
npx shadcn@latest add popover
```

### Usage
```tsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
```

---

## Toggle Group

### Description
A set of two-state buttons that can be toggled on or off.

### Installation
```bash
npx shadcn@latest add toggle-group
```

### Usage
```tsx
<ToggleGroup type="single">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
</ToggleGroup>
```

---

## Input

### Description
Displays a form input field or a component that looks like an input field.

### Installation
```bash
npx shadcn@latest add input
```

### Usage
```tsx
<Input />
```

---

## Dropdown Menu

### Description
Displays a menu to the user — such as a set of actions or functions — triggered by a button.

### Installation
```bash
npx shadcn@latest add dropdown-menu
```

### Usage
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Sheet

### Description
Extends the Dialog component to display content that complements the main content of the screen.

### Installation
```bash
npx shadcn@latest add sheet
```

### Usage
```tsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

---

## Scroll-area

### Description
Augments native scroll functionality for custom, cross-browser styling.

### Installation
```bash
npx shadcn@latest add scroll-area
```

### Usage
```tsx
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  Jokester began sneaking into the castle in the middle of the night and leaving
  jokes all over the place: under the king's pillow, in his soup, even in the
  royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
  then, one day, the people of the kingdom discovered that the jokes left by
  Jokester were so funny that they couldn't help but laugh. And once they
  started laughing, they couldn't stop.
</ScrollArea>
```

---

## Context Menu

### Description
Displays a menu to the user — such as a set of actions or functions — triggered by a button.

### Installation
```bash
npx shadcn@latest add context-menu
```

### Usage
```tsx
<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem>Team</ContextMenuItem>
    <ContextMenuItem>Subscription</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## Date Picker

### Description
A date picker component with range and presets.

---

## Progress

### Description
Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

### Installation
```bash
npx shadcn@latest add progress
```

### Usage
```tsx
<Progress value={33} />
```

---

## Toast

### Description
A succinct message that is displayed temporarily.

### Installation
```bash
npx shadcn@latest add toast
```

---

## Separator

### Description
Visually or semantically separates content.

### Installation
```bash
npx shadcn@latest add separator
```

### Usage
```tsx
<Separator />
```

---

## Sonner

### Description
An opinionated toast component for React.

### Installation
```bash
npx shadcn@latest add sonner
```

### Usage
```tsx
toast("Event has been created.")
```

---

## Card

### Description
Displays a card with header, content, and footer.

### Installation
```bash
npx shadcn@latest add card
```

### Usage
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

---

## Carousel

### Description
A carousel with motion and swipe built using Embla.

### Installation
```bash
npx shadcn@latest add carousel
```

### Usage
```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

## Navigation Menu

### Description
A collection of links for navigating websites.

### Installation
```bash
npx shadcn@latest add navigation-menu
```

### Usage
```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Radio Group

### Description
A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.

### Installation
```bash
npx shadcn@latest add radio-group
```

### Usage
```tsx
<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

---

## Switch

### Description
A control that allows the user to toggle between checked and not checked.

### Installation
```bash
npx shadcn@latest add switch
```

### Usage
```tsx
<Switch />
```

---

## Menubar

### Description
A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.

### Installation
```bash
npx shadcn@latest add menubar
```

### Usage
```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## Avatar

### Description
An image element with a fallback for representing the user.

### Installation
```bash
npx shadcn@latest add avatar
```

### Usage
```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

---

## Breadcrumb

### Description
Displays the path to the current resource using a hierarchy of links.

### Installation
```bash
npx shadcn@latest add breadcrumb
```

### Usage
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Label

### Description
Renders an accessible label associated with controls.

### Installation
```bash
npx shadcn@latest add label
```

### Usage
```tsx
<Label htmlFor="email">Your email address</Label>
```

---

## Tooltip

### Description
A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

### Installation
```bash
npx shadcn@latest add tooltip
```

### Usage
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Sidebar

### Description
A composable, themeable and customizable sidebar component.

### Installation
```bash
npx shadcn@latest add sidebar
```

### Usage
```tsx
showLineNumbers title="components/app-sidebar.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
```

---

## Table

### Description
A responsive table component.

### Installation
```bash
npx shadcn@latest add table
```

### Usage
```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Dialog

### Description
A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

### Installation
```bash
npx shadcn@latest add dialog
```

### Usage
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## Button

### Description
Displays a button or a component that looks like a button.

### Installation
```bash
npx shadcn@latest add button
```

### Usage
```tsx
<Button variant="outline">Button</Button>
```

---

## Command

### Description
Fast, composable, unstyled command menu for React.

### Installation
```bash
npx shadcn@latest add command
```

### Usage
```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

## Pagination

### Description
Pagination with page navigation, next and previous links.

### Installation
```bash
npx shadcn@latest add pagination
```

### Usage
```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Accordion

### Description
A vertically stacked set of interactive headings that each reveal a section of content.

### Installation
```bash
npx shadcn@latest add accordion
```

### Usage
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Drawer

### Description
A drawer component for React.

### Installation
```bash
npx shadcn@latest add drawer
```

### Usage
```tsx
showLineNumbers
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## Checkbox

### Description
A control that allows the user to toggle between checked and not checked.

### Installation
```bash
npx shadcn@latest add checkbox
```

### Usage
```tsx
<Checkbox />
```

---

## Input OTP

### Description
Accessible one-time password component with copy paste functionality.

### Installation
```bash
npx shadcn@latest add input-otp
```

### Usage
```tsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

## Slider

### Description
An input where the user selects a value from within a given range.

### Installation
```bash
npx shadcn@latest add slider
```

### Usage
```tsx
<Slider defaultValue={[33]} max={100} step={1} />
```

---

## Chart

### Description
Beautiful charts. Built using Recharts. Copy and paste into your apps.

### Installation
```bash
npx shadcn@latest add chart
```

---

## Select

### Description
Displays a list of options for the user to pick from—triggered by a button.

### Installation
```bash
npx shadcn@latest add select
```

### Usage
```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

---

## Skeleton

### Description
Use to show a placeholder while content is loading.

### Installation
```bash
npx shadcn@latest add skeleton
```

### Usage
```tsx
<Skeleton className="w-[100px] h-[20px] rounded-full" />
```

---

## Typography

### Description
Styles for headings, paragraphs, lists...etc

---

## Resizable

### Description
Accessible resizable panel groups and layouts with keyboard support.

### Installation
```bash
npx shadcn@latest add resizable
```

### Usage
```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

---

## Badge

### Description
Displays a badge or a component that looks like a badge.

### Installation
```bash
npx shadcn@latest add badge
```

### Usage
```tsx
<Badge variant="outline">Badge</Badge>
```

---

